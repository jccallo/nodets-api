const {
   validate,
   array,
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

console.log('=== INICIANDO TESTEO INTENSIVO DE ARRAY-VALIDATOR ===\n')

// 1. Tipo Básico
console.log('--- 1. Validación de Tipo ---')
const schemaType = { tags: array() }
runTest('Array válido', { tags: [1, 2, 3] }, schemaType, true)
runTest('Array vacío', { tags: [] }, schemaType, true)
runTest('Error: Es string', { tags: 'no-array' }, schemaType, false)
runTest('Error: Es objeto', { tags: {} }, schemaType, false)
runTest('Error: Es null', { tags: null }, schemaType, false)

// 2. Longitud (minLength/maxLength)
console.log('\n--- 2. Longitud (minLength/maxLength) ---')
const schemaLen = { items: array().minLength(2).maxLength(4) }
runTest('Longitud: OK (3 elementos)', { items: [1, 2, 3] }, schemaLen, true)
runTest('Longitud: Límite inferior (2)', { items: [1, 2] }, schemaLen, true)
runTest('Longitud: Límite superior (4)', { items: [1, 2, 3, 4] }, schemaLen, true)
runTest('Error: Demasiado corto (1)', { items: [1] }, schemaLen, false)
runTest('Error: Demasiado largo (5)', { items: [1, 2, 3, 4, 5] }, schemaLen, false)

// 3. Inclusión (includes)
console.log('\n--- 3. Inclusión (includes) ---')
const schemaInc = { colors: array().includes('red') }
runTest('Includes: Exacto', { colors: ['blue', 'red', 'green'] }, schemaInc, true)
runTest('Includes: Diferente caso (CI por diseño)', { colors: ['RED', 'BLUE'] }, schemaInc, true)
runTest('Error: No incluye', { colors: ['blue', 'green'] }, schemaInc, false)

// 4. Casos de Borde y Combinaciones
console.log('\n--- 4. Casos de Borde y Combinaciones ---')
const schemaEdge = {
   meta: optional().array(),
   history: optional().nullable().array().minLength(1),
   bundle: array().minLength(1).includes('primary'),
}

runTest('Borde: Opcional ausente', { bundle: ['primary'] }, schemaEdge, true)
runTest('Borde: Nullable es null', { history: null, bundle: ['primary'] }, schemaEdge, true)
runTest('Borde: Combinación exitosa', { bundle: ['primary', 'secondary'] }, schemaEdge, true)
runTest('Error: Combinación falla (minLength)', { bundle: [] }, schemaEdge, false)
runTest('Error: Combinación falla (includes)', { bundle: ['secondary'] }, schemaEdge, false)

// 5. Elementos no atómicos (objetos en array)
console.log('\n--- 5. Elementos no Atómicos ---')
const schemaObjects = { list: array().includes('match') }
runTest('Includes en array de strings (ya probado)', { list: ['match'] }, schemaObjects, true)
// Nota: .includes actual convierte cada item a String() y lo compara.
// ['match'] -> String('match') === 'match' -> True

console.log('\n=== TESTEO FINALIZADO ===')
