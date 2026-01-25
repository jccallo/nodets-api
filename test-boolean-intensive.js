const {
   validate,
   boolean,
   optional,
   nullable,
} = require('./src/shared/infrastructure/validation/easy-validator/index.js')

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
   return { passed, result }
}

console.log('=== INICIANDO TESTEO INTENSIVO DE BOOLEAN-VALIDATOR ===\n')

// 1. Tipo Básico (Híbrido)
console.log('--- 1. Validación de Tipo (Híbrido) ---')
const schemaType = { active: boolean() }
runTest('Boolean true', { active: true }, schemaType, true)
runTest('Boolean false', { active: false }, schemaType, true)
runTest('String "true"', { active: 'true' }, schemaType, true)
runTest('String "1"', { active: '1' }, schemaType, true)
runTest('Number 0', { active: 0 }, schemaType, true)
runTest('Error: Es string aleatorio', { active: 'not-bool' }, schemaType, false)
runTest('Error: Es número aleatorio', { active: 5 }, schemaType, false)

// 2. Opcionales y Nullables
console.log('\n--- 2. Opcionales y Nullables ---')
const schemaOpt = {
   show: optional().boolean(),
   premium: nullable().boolean(),
}
runTest('Opcional: Ausente', {}, schemaOpt, true)
runTest('Nullable: Null', { premium: null }, schemaOpt, true)
runTest('Combinación: True', { show: false, premium: 1 }, schemaOpt, true)

// 3. Conversión
console.log('\n--- 3. Conversión ---')
const schemaConv = { active: boolean().convert() }
const resConv = validate({ active: 'true' }, schemaConv)
if (resConv.data.active === true && typeof resConv.data.active === 'boolean') {
   console.log('✅ Conversión de "true" a boolean exitosa')
}

console.log('\n=== TESTEO FINALIZADO ===')
