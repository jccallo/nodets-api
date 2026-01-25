const {
   validate,
   string,
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

console.log('=== INICIANDO TESTEO INTENSIVO DE STRING-VALIDATOR ===\n')

// 1. Tipo Básico
console.log('--- 1. Validación de Tipo ---')
const schemaType = { name: string() }
runTest('String válido', { name: 'Carlos' }, schemaType, true)
runTest('Error: Es número', { name: 123 }, schemaType, false)
runTest('Error: Es objeto', { name: {} }, schemaType, false)
runTest('Error: Es null (debe ser string)', { name: null }, schemaType, false)

// 2. Longitud (min/max)
console.log('\n--- 2. Longitud (min/max) ---')
const schemaLen = { username: string().min(3).max(10) }
runTest('Longitud: OK', { username: 'abc' }, schemaLen, true)
runTest('Longitud: Límite superior', { username: '1234567890' }, schemaLen, true)
runTest('Error: Demasiado corto', { username: 'ab' }, schemaLen, false)
runTest('Error: Demasiado largo', { username: '12345678901' }, schemaLen, false)

// 3. Listas (inList) - Case Insensitive actual
console.log('\n--- 3. Listas (inList) ---')
const schemaList = { role: string().inList(['Admin', 'Moderator']) }
runTest('Lista: Exacto', { role: 'Admin' }, schemaList, true)
runTest('Lista: Diferente caso (debería pasar por lógica actual)', { role: 'admin' }, schemaList, true)
runTest('Error: No en lista', { role: 'Guest' }, schemaList, false)

// 4. Inclusión (includes) - Case Insensitive actual
console.log('\n--- 4. Inclusión (includes) ---')
const schemaInc = { bio: string().includes('node') }
runTest('Includes: Exacto', { bio: 'i love node' }, schemaInc, true)
runTest('Includes: Diferente caso', { bio: 'I LOVE NODE' }, schemaInc, true)
runTest('Error: No incluye', { bio: 'i love java' }, schemaInc, false)

// 5. Casos de Borde y Combinaciones
console.log('\n--- 5. Casos de Borde y Combinaciones ---')
const schemaEdge = {
   id: optional().string(),
   tag: optional().nullable().string().min(2),
   complex: optional().string().min(5).includes('valid').inList(['is valid', 'was valid']),
}

runTest('Borde: Opcional ausente', {}, schemaEdge, true)
runTest('Borde: Nullable es null', { tag: null, complex: 'is valid' }, schemaEdge, true)
runTest('Borde: Combinación exitosa', { complex: 'is valid' }, schemaEdge, true)
runTest('Error: Combinación falla (min)', { complex: 'valid' }, schemaEdge, false) // Falla min(5)
runTest('Error: Combinación falla (includes)', { complex: 'is val' }, schemaEdge, false) // Falla includes y inList

// 6. Espacios y strings vacíos
console.log('\n--- 6. Espacios y Strings Vacíos ---')
const schemaSpaces = {
   required: string(),
   optionalStr: optional().string(),
}
runTest('String con espacios', { required: '   ' }, schemaSpaces, true) // Actual: typeof === 'string'
runTest('Error: String vacío en requerido (según lógica actual)', { required: '' }, schemaSpaces, false)

console.log('\n=== TESTEO FINALIZADO ===')
