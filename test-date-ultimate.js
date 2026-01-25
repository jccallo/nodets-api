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
      if (result.errors) console.log('   Errors:', JSON.stringify(result.errors))
   }
   return passed
}

console.log('=== TESTEO ULTIMATE: DATE-VALIDATOR (TODO EN UNO) ===\n')

// 1. MULTIFORMATO & ISO
console.log('--- 1. Soporte Multiformato (ISO, Slashes, Hyphens) ---')
const schemaMultiformat = { event: date() }
runTest('ISO Standard (dash)', { event: '2024-05-20' }, schemaMultiformat, true)
runTest('ISO Extended (T + Z)', { event: '2024-05-20T15:00:00Z' }, schemaMultiformat, true)
runTest('Slash Format', { event: '2024/05/20' }, schemaMultiformat, true)
runTest('Slash with Time', { event: '2024/05/20 14:00:00' }, schemaMultiformat, true)
runTest('Error: Solo Hora', { event: '14:00:00' }, schemaMultiformat, false)

// 2. RANGOS INTELIGENTES (CAPTURANDO DÍAS COMPLETOS)
console.log('\n--- 2. Rangos Inteligentes (Captura de Día Completo) ---')
const schemaWholeDay = { event: date().start('2024-01-01').end('2024-01-01') }
runTest('2024-01-01 00:00:00 (Start Inclusivo)', { event: '2024-01-01' }, schemaWholeDay, true)
runTest('2024-01-01 23:59:59 (End Inclusivo via Default)', { event: '2024-01-01 23:59:59' }, schemaWholeDay, true)
runTest(
   'Falla: 2024-01-02 00:00:00 (Limite del día siguiente)',
   { event: '2024-01-02 00:00:00' },
   schemaWholeDay,
   false,
)

// 3. HORAS RELATIVAS (HORARIO DE OFICINA)
console.log('\n--- 3. Horas Relativas (Work Shifts) ---')
const schemaOffice = { event: date().start('08:30').end('17:30') }
runTest('Pasa: Lunes 9 AM', { event: '2024-06-10 09:00:00' }, schemaOffice, true)
runTest('Pasa: Domingo 10 AM (Valida hora, no dia)', { event: '2024-06-09 10:00:00' }, schemaOffice, true)
runTest('Falla: Tarde (6 PM)', { event: '2024-06-10 18:00:00' }, schemaOffice, false)

// 4. CONVERSION IANA + PRECISION
console.log('\n--- 4. Conversión IANA & Timezone Shifts ---')
const schemaConvert = { event: date().convert('America/Lima') }
runTest(
   'UTC Midnight -> 7 PM Lima (Día Previo)',
   { event: '2024-01-01 00:00:00' },
   schemaConvert,
   true,
   '2023-12-31 19:00:00',
)
runTest('Check Formato Final', { event: '2024-05-15 10:30:05' }, schemaConvert, true, '2024-05-15 05:30:05')

// 5. EL "TRIPLE COMBO" (ORDEN DE CADENA)
console.log('\n--- 5. Combo: ISO Input -> Lima Convert -> Office Hours Valid ---')
const schemaCombo = {
   event: date().convert('America/Lima').start('08:00').end('17:00'),
}
// 2:00 PM UTC es 9:00 AM Lima. Debería pasar.
runTest('Pasa: 2 PM UTC es 9 AM Lima', { event: '2024-12-31T14:00:00Z' }, schemaCombo, true, '2024-12-31 09:00:00')
// 10:00 PM UTC es 5:01 PM Lima. Debería fallar (por 1 minuto).
runTest('Falla: 10:01 PM UTC es 5:01 PM Lima', { event: '2024-12-31T22:01:00Z' }, schemaCombo, false)

console.log('\n=== TESTEO ULTIMATE COMPLETADO ===')
