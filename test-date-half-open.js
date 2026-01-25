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

console.log('=== VERIFICACIÓN DE INTERVALOS SEMIABIERTOS [start, end) ===\n')

// Escenario: Todo el día 1 de Enero de 2024
// Usamos .start('2024-01-01') que es 2024-01-01 00:00:00
// Usamos .end('2024-01-02') que es 2024-01-02 00:00:00
const schema = {
   event: date().start('2024-01-01').end('2024-01-02'),
}

console.log('--- Rango: 2024-01-01 (Incl) a 2024-01-02 (Excl) ---')
runTest('Inclusivo: Inicio exacto (00:00:00)', { event: '2024-01-01 00:00:00' }, schema, true)
runTest('Interno: Mitad del día (12:00:00)', { event: '2024-01-01 12:00:00' }, schema, true)
runTest('Interno: Casi medianoche (23:59:59)', { event: '2024-01-01 23:59:59' }, schema, true)
runTest('Exclusivo: Fin exacto (Día siguiente 00:00:00)', { event: '2024-01-02 00:00:00' }, schema, false)
runTest('Rechazo: Día anterior', { event: '2023-12-31 23:59:59' }, schema, false)

console.log('\n--- Ejemplo de uso sugerido para "Todo un día" ---')
const schemaSingleDay = {
   day: date().start('2024-01-01').end('2024-01-02'),
}
if (
   validate({ day: '2024-01-01' }, schemaSingleDay).success === true &&
   validate({ day: '2024-01-02' }, schemaSingleDay).success === false
) {
   console.log('✅ El patrón start(hoy).end(mañana) funciona perfectamente para capturar 1 día completo.')
}

console.log('\n=== VERIFICACIÓN FINALIZADA ===')
