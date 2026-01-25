const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const runTest = (name, data, schema, expectedValue) => {
   const result = validate(data, schema)
   const actualValue = result.data.event
   const passed = result.success && actualValue === expectedValue

   if (passed) {
      console.log(`✅ [PASSED] ${name} -> ${actualValue}`)
   } else {
      console.log(`❌ [FAILED] ${name}`)
      console.log('   Expected:', expectedValue)
      console.log('   Got:', actualValue)
      if (result.errors) console.log('   Errors:', JSON.stringify(result.errors))
   }
   return passed
}

console.log('=== TESTEO INTENSIVO: DATE CONVERSION & TIMEZONES ===\n')

// 1. Formato Estándar e Inferencia UTC
console.log('--- 1. Formato y UTC ---')
const schemaUTC = { event: date().convert('UTC') }
runTest('Solo fecha (YYYY-MM-DD)', { event: '2024-01-01' }, schemaUTC, '2024-01-01 00:00:00')
runTest('Fecha y Hora', { event: '2024-01-01 15:30:45' }, schemaUTC, '2024-01-01 15:30:45')

// 2. Desplazamiento a Lima (UTC-5)
console.log('\n--- 2. Conversión a Lima (America/Lima) ---')
const schemaLima = { event: date().convert('America/Lima') }
runTest(
   'Medianoche UTC -> 7 PM Lima (Día anterior)',
   { event: '2024-01-01 00:00:00' },
   schemaLima,
   '2023-12-31 19:00:00',
)
runTest('Casi medianoche UTC -> 7 PM Lima', { event: '2024-05-15 00:00:00' }, schemaLima, '2024-05-14 19:00:00')

// 3. Desplazamiento a Madrid (UTC+1 / UTC+2 DST)
console.log('\n--- 3. Conversión a Madrid (Europe/Madrid) ---')
const schemaMadrid = { event: date().convert('Europe/Madrid') }
runTest('Invierno: 10 AM UTC -> 11 AM Madrid', { event: '2024-01-15 10:00:00' }, schemaMadrid, '2024-01-15 11:00:00')
runTest(
   'Verano: 10 AM UTC -> 12 PM Madrid (DST)',
   { event: '2024-07-15 10:00:00' },
   schemaMadrid,
   '2024-07-15 12:00:00',
)

// 4. Casos de Borde: Fin de Año y Bisiestos
console.log('\n--- 4. Bordes: Fin de Año y Bisiestos ---')
runTest('Fin de Año Lima (UTC)', { event: '2024-12-31 23:59:59' }, schemaUTC, '2024-12-31 23:59:59')
runTest('Fin de Año Lima -> Madrid', { event: '2024-12-31 23:59:59' }, schemaMadrid, '2025-01-01 00:59:59')
runTest('29 Feb -> Madrid', { event: '2024-02-29 23:30:00' }, schemaMadrid, '2024-03-01 00:30:00')

// 5. Encadenamiento: Convert + Start/End
console.log('\n--- 5. Encadenamiento: Convert + Start/End ---')
const schemaChain = {
   event: date().convert('America/Lima').start('2024-01-01 08:00:00').end('2024-01-01 17:00:00'),
}

console.log('Validando que 2 PM UTC (9 AM Lima) pase...')
runTest('Cadena exitosa (Business Hours)', { event: '2024-01-01 14:00:00' }, schemaChain, '2024-01-01 09:00:00')

console.log('\n=== TESTEO FINALIZADO ===')
