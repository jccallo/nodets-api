const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const runTest = (name, data, schema, expectedSuccess) => {
   const result = validate(data, schema)
   const passed = result.success === expectedSuccess
   if (passed) {
      console.log(`✅ [PASSED] ${name}`)
   } else {
      console.log(`❌ [FAILED] ${name}`)
      console.log('   Expected success:', expectedSuccess)
      console.log('   Got success:', result.success)
      console.log('   Data:', JSON.stringify(data))
      console.log('   Errors:', JSON.stringify(result.errors))
   }
}

console.log('=== TESTEO INTENSIVO DATE-VALIDATOR (Bordes y Rangos) ===\n')

// 1. Escenario: Todo un día (Full Day Range)
console.log('--- 1. Rango de Todo un Día ---')
// Definimos el rango del 1 de enero de 2024 completo
const schemaFullDay = {
   appointment: date().start('2024-01-01 00:00:00').end('2024-01-01 23:59:59'),
}

runTest('Inicio del día (00:00:00)', { appointment: '2024-01-01 00:00:00' }, schemaFullDay, true)
runTest('Medio día (12:00:00)', { appointment: '2024-01-01 12:00:00' }, schemaFullDay, true)
runTest('Casi fin de día (23:59:59)', { appointment: '2024-01-01 23:59:59' }, schemaFullDay, true)
runTest('Error: Día anterior', { appointment: '2023-12-31 23:59:59' }, schemaFullDay, false)
runTest('Error: Día siguiente', { appointment: '2024-01-02 00:00:00' }, schemaFullDay, false)

// 2. Años Bisiestos
console.log('\n--- 2. Años Bisiestos ---')
const schemaDate = { d: date() }
runTest('29 de Feb 2024 (Bisiesto)', { d: '2024-02-29' }, schemaDate, true)
runTest('Error: 29 de Feb 2023 (No Bisiesto)', { d: '2023-02-29' }, schemaDate, false)

// 3. Conversión y Rangos combinados
console.log('\n--- 3. Conversión + Rangos (UTC vs Lima) ---')
// Si recibo un dato en UTC, pero quiero validar que en LIMA sea un día específico
const schemaMixed = {
   event: date()
      .convert('America/Lima') // Transformamos primero
      .start('2024-01-01 08:00:00') // Las reglas se aplican al valor TRANSFORMADO
      .end('2024-01-01 17:00:00'),
}

// Entrada: 2 PM UTC -> En Lima son las 9 AM (Pasa)
runTest('Evento en hora de Lima (9 AM)', { event: '2024-01-01 14:00:00' }, schemaMixed, true)
// Entrada: 11 PM UTC -> En Lima son las 6 PM (Falla por ser tarde)
runTest('Evento fuera de hora Lima (6 PM)', { event: '2024-01-01 23:00:00' }, schemaMixed, false)

// 4. Formatos curiosos
console.log('\n--- 4. Formatos Permitidos ---')
runTest('Formato con Slashes', { d: '2024/01/01' }, schemaDate, true)
runTest('ISO completo con milisegundos', { d: '2024-01-01T10:00:00.123Z' }, schemaDate, true)

console.log('\n=== TESTEO FINALIZADO ===')
