const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const runTest = (name, data, schema, expectedSuccess) => {
   const result = validate(data, schema)
   const passed = result.success === expectedSuccess
   if (passed) {
      console.log(`✅ [PASSED] ${name}`)
   } else {
      console.log(`❌ [FAILED] ${name}`)
      console.log('   Expected success:', expectedSuccess)
      console.log('   Data:', JSON.stringify(data))
      console.log('   Errors:', JSON.stringify(result.errors))
   }
}

console.log('=== VERIFICACIÓN DE RANGOS INCLUSIVOS E INTELIGENTES ===\n')

// Escenario: Capturar exactamente un día (1 de Enero de 2024)
const schemaSingleDay = {
   event: date().start('2024-01-01').end('2024-01-01'),
}

console.log('--- Rango: .start("2024-01-01") .end("2024-01-01") ---')
runTest('Inclusivo: Inicio exacto (2024-01-01)', { event: '2024-01-01' }, schemaSingleDay, true)
runTest('Inclusivo: Mitad del día (12:00:00)', { event: '2024-01-01 12:00:00' }, schemaSingleDay, true)
runTest('Inclusivo: Fin del día (23:59:59)', { event: '2024-01-01 23:59:59' }, schemaSingleDay, true)
runTest('Rechazo: Día anterior', { event: '2023-12-31 23:59:59' }, schemaSingleDay, false)
runTest('Rechazo: Día siguiente', { event: '2024-01-02 00:00:00' }, schemaSingleDay, false)

console.log('\n--- Respeto de horas explícitas ---')
const schemaExplicit = {
   shift: date().start('2024-01-01 08:00:00').end('2024-01-01 17:00:00'),
}
runTest('Pasa dentro de horas', { shift: '2024-01-01 15:00:00' }, schemaExplicit, true)
runTest('Falla fuera de horas (mañana)', { shift: '2024-01-01 07:59:59' }, schemaExplicit, false)
runTest('Falla fuera de horas (tarde)', { shift: '2024-01-01 17:00:01' }, schemaExplicit, false)

console.log('\n=== VERIFICACIÓN FINALIZADA ===')
