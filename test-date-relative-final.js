const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const runTest = (name, data, schema, expectedSuccess) => {
   const result = validate(data, schema)
   const passed = result.success === expectedSuccess
   if (passed) {
      console.log(`✅ [PASSED] ${name}`)
   } else {
      console.log(`❌ [FAILED] ${name}`)
      console.log('   Expected:', expectedSuccess)
      console.log('   Data:', JSON.stringify(data))
      if (result.errors) console.log('   Errors:', JSON.stringify(result.errors))
   }
}

console.log('=== VERIFICACIÓN DE HORAS RELATIVAS EN RANGOS ===\n')

// Escenario: Horario de oficina (08:30 a 17:30)
const schemaOffice = {
   punchIn: date().start('08:30').end('17:30'),
}

console.log('--- Rango: 08:30 a 17:30 (Cualquier día) ---')
runTest('Pasa: En horario (Lunes, 10 AM)', { punchIn: '2024-01-01 10:00:00' }, schemaOffice, true)
runTest('Pasa: Limite exacto (08:30)', { punchIn: '2024-01-01 08:30:00' }, schemaOffice, true)
runTest('Falla: Muy temprano (07:00)', { punchIn: '2024-01-01 07:00:00' }, schemaOffice, false)
runTest('Falla: Día distinto pero fuera de hora', { punchIn: '2024-07-20 18:00:00' }, schemaOffice, false)

console.log('\n--- Integración con CONVERT (Lima) ---')
// Escenario: Recibimos UTC, pasamos a Lima, y validamos horario de oficina de Lima
const schemaLimaOffice = {
   event: date().convert('America/Lima').start('08:00').end('17:00'),
}

// 2 PM UTC -> 9 AM Lima (Debería pasar)
runTest('Pasa: 2 PM UTC es 9 AM Lima', { event: '2024-01-01 14:00:00' }, schemaLimaOffice, true)
// 11 PM UTC -> 6 PM Lima (Debería fallar)
runTest('Falla: 11 PM UTC es 6 PM Lima', { event: '2024-01-01 23:00:00' }, schemaLimaOffice, false)

console.log('\n=== VERIFICACIÓN FINALIZADA ===')
