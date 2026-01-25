const { validate, date, optional, nullable } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

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

console.log('=== TESTEO INTENSIVO DATE-VALIDATOR ===\n')

// 1. Formatos Básicos
console.log('--- 1. Formatos de Fecha ---')
const schemaBasic = { eventDate: date() }
runTest('Fecha simple (YYYY-MM-DD)', { eventDate: '2023-12-31' }, schemaBasic, true)
runTest('Fecha con hora (YYYY-MM-DD HH:mm)', { eventDate: '2023-12-31 23:59' }, schemaBasic, true)
runTest('Fecha ISO', { eventDate: '2023-12-31T23:59:59.000Z' }, schemaBasic, true)
runTest('Error: Solo hora (12:00)', { eventDate: '12:00' }, schemaBasic, false)
runTest('Error: Solo hora con segundos', { eventDate: '12:00:55' }, schemaBasic, false)
runTest('Error: Fecha inexistente (Feb 30)', { eventDate: '2023-02-30' }, schemaBasic, false)
runTest('Error: No es string', { eventDate: 20231231 }, schemaBasic, false)

// 2. Rangos (start / end)
console.log('\n--- 2. Rangos (start/end) ---')
const schemaRange = {
   birthday: date().start('1900-01-01').end('2024-01-01'),
}
runTest('Rango: En el medio', { birthday: '1990-05-15' }, schemaRange, true)
runTest('Rango: Límite exacto start', { birthday: '1900-01-01' }, schemaRange, true)
runTest('Rango: Límite exacto end', { birthday: '2024-01-01' }, schemaRange, true)
runTest('Error: Antes del inicio', { birthday: '1899-12-31' }, schemaRange, false)
runTest('Error: Después del fin', { birthday: '2024-01-02' }, schemaRange, false)

// 3. Opcionales y Nullables
console.log('\n--- 3. Opcionales y Nullables ---')
const schemaFlex = {
   p1: optional().date(),
   p2: optional().nullable().date().start('2000-01-01'),
}
runTest('Opcional: Ausente', {}, schemaFlex, true)
runTest('Nullable: Null', { p2: null }, schemaFlex, true)
runTest('Nullable: Válido', { p2: '2023-01-01' }, schemaFlex, true)
runTest('Error: Nullable fuera de rango', { p2: '1999-01-01' }, schemaFlex, false)

console.log('\n=== TESTEO FINALIZADO ===')
