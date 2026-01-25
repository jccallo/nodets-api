const {
   validate,
   boolean,
   optional,
   nullable,
} = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const runTest = (name, data, schema, expectedSuccess, expectedConvertedValue = undefined, expectedType = undefined) => {
   const result = validate(data, schema)
   let passed = result.success === expectedSuccess

   let conversionInfo = ''
   if (passed && expectedSuccess && expectedConvertedValue !== undefined) {
      const actualValue = result.data.active
      const actualType = typeof actualValue
      if (actualValue !== expectedConvertedValue || actualType !== expectedType) {
         passed = false
         conversionInfo = ` | Error Conv: Got ${actualValue} (${actualType}), expected ${expectedConvertedValue} (${expectedType})`
      } else {
         conversionInfo = ` | Conv: ${actualValue} (${actualType}) ✅`
      }
   }

   if (passed) {
      console.log(`✅ [PASSED] ${name}${conversionInfo}`)
   } else {
      console.log(`❌ [FAILED] ${name}${conversionInfo}`)
      console.log('   Data:', JSON.stringify(data))
      console.log('   Errors:', JSON.stringify(result.errors))
   }
}

console.log('=== TESTEO INTENSIVO BOOLEAN-VALIDATOR (Lógica de 8 Valores) ===\n')

const schemaVal = { active: boolean() }
const schemaConv = { active: boolean().convert() }

console.log('--- 1. Los 8 Valores Permitidos (Familia Boolean) ---')
runTest('true (bool)', { active: true }, schemaConv, true, true, 'boolean')
runTest('false (bool)', { active: false }, schemaConv, true, false, 'boolean')
runTest('"true" (str)', { active: 'true' }, schemaConv, true, true, 'boolean')
runTest('"false" (str)', { active: 'false' }, schemaConv, true, false, 'boolean')

console.log('\n--- 2. Los 8 Valores Permitidos (Familia Number) ---')
runTest('1 (num)', { active: 1 }, schemaConv, true, 1, 'number')
runTest('0 (num)', { active: 0 }, schemaConv, true, 0, 'number')
runTest('"1" (str)', { active: '1' }, schemaConv, true, 1, 'number')
runTest('"0" (str)', { active: '0' }, schemaConv, true, 0, 'number')

console.log('\n--- 3. Valores Prohibidos (Truthy/Falsy descartados) ---')
runTest('Numero 2', { active: 2 }, schemaVal, false)
runTest('Numero -1', { active: -1 }, schemaVal, false)
runTest('String "2"', { active: '2' }, schemaVal, false)
runTest('String ""', { active: '' }, schemaVal, false)
runTest('String " "', { active: ' ' }, schemaVal, false)
runTest('String "NaN"', { active: 'NaN' }, schemaVal, false)
runTest('Objeto {}', { active: {} }, schemaVal, false)
runTest('Array []', { active: [] }, schemaVal, false)

console.log('\n--- 4. Casos de Borde (Opcionales / Null) ---')
const schemaFlex = {
   opt: optional().boolean().convert(),
   nulla: optional().nullable().boolean().convert(),
}
runTest('Opcional Ausente', {}, schemaFlex, true)
runTest('Nullable es null', { nulla: null }, schemaFlex, true)
if (validate({ nulla: null }, schemaFlex).data.nulla === null) console.log('✅ Null se mantiene como null')

console.log('\n--- 5. Validación sin Convert (Dato Original) ---')
const resPure = validate({ active: '1' }, schemaVal)
if (resPure.data.active === '1' && typeof resPure.data.active === 'string') {
   console.log('✅ Sin convert(), el valor "1" se mantiene como String')
}

console.log('\n=== TESTEO FINALIZADO ===')
