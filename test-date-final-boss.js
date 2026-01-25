const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const runTest = (name, data, schema, expectedSuccess, expectedConvertedValue = undefined) => {
   const result = validate(data, schema)
   let passed = result.success === expectedSuccess

   let convInfo = ''
   if (passed && expectedSuccess && expectedConvertedValue !== undefined) {
      const actual = result.data.event
      if (actual !== expectedConvertedValue) {
         passed = false
         convInfo = ` | Error Conv: Got "${actual}", expected "${expectedConvertedValue}"`
      } else {
         convInfo = ` | Value: "${actual}" ✅`
      }
   }

   if (passed) {
      console.log(`✅ [PASSED] ${name}${convInfo}`)
   } else {
      console.log(`❌ [FAILED] ${name}${convInfo}`)
      console.log('   Data:', JSON.stringify(data))
      console.log('   Errors:', JSON.stringify(result.errors))
   }
}

console.log('=== TESTEO FINAL EXHAUSTIVO: DATE-VALIDATOR "FINAL BOSS" ===\n')

// 1. La "Magia" del Día Único
console.log('--- 1. Rango de día único (Smart Defaults) ---')
const schemaDay = { event: date().start('2024-05-20').end('2024-05-20') }
runTest('Inclusivo: Medianoche (00:00:00)', { event: '2024-05-20 00:00:00' }, schemaDay, true)
runTest('Inclusivo: Fin de día (23:59:59)', { event: '2024-05-20 23:59:59' }, schemaDay, true)
runTest('Error: 1 segundo después (Día siguiente)', { event: '2024-05-21 00:00:00' }, schemaDay, false)

// 2. Fronteras Horarias (IANA Standard Only)
console.log('\n--- 2. Fronteras Horarias (America/Lima vs UTC) ---')
const schemaTZ = { event: date().convert('America/Lima') }
runTest('UTC -> Lima (Cruce de año)', { event: '2024-01-01 04:00:00' }, schemaTZ, true, '2023-12-31 23:00:00')
runTest('UTC -> Lima (Medianoche exacta)', { event: '2024-01-01 05:00:00' }, schemaTZ, true, '2024-01-01 00:00:00')

// 3. Cadena Compleja: Recibir UTC, Validar Business Hours en Lima
console.log('\n--- 3. Workflow Complejo: UTC Input + Office Hours Lima ---')
const schemaWorkflow = {
   event: date().convert('America/Lima').start('09:00:00').end('18:00:00'),
}
runTest(
   'UTC 2 PM (9 AM Lima) -> Business Hours OK',
   { event: '2024-05-15 14:00:00' },
   schemaWorkflow,
   true,
   '2024-05-15 09:00:00',
)
runTest('UTC 11 PM (6:01 PM Lima) -> Falla por ser tarde', { event: '2024-05-15 23:01:00' }, schemaWorkflow, false)

// 4. Formatos y Seguridad
console.log('\n--- 4. Formatos y Casos de Borde ---')
const schemaStrict = { event: date() }
runTest('Formato Slashes', { event: '2024/05/20 10:00' }, schemaStrict, true)
runTest('ISO completo', { event: '2024-05-20T10:00:00Z' }, schemaStrict, true)
runTest('Error: Día inválido (2024-02-30)', { event: '2024-02-30' }, schemaStrict, false)
runTest('Error: Solo Hora', { event: '12:00:00' }, schemaStrict, false)

console.log('\n=== TESTEO COMPLETADO ===')
