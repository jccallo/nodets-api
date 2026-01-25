const { array, validate, optional } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const schema = {
   tags: array().minLength(2).maxLength(4).includes('Node'),
   categories: optional().array().includes('Backend'),
}

const testCases = [
   {
      name: 'Array Success: Full match',
      data: { tags: ['NODE', 'express', 'javascript'] },
      expectSuccess: true,
   },
   {
      name: 'Array Success: Optional missing',
      data: { tags: ['node', 'mongo'] },
      expectSuccess: true,
   },
   {
      name: 'Array Fail: too short',
      data: { tags: ['node'] },
      expectSuccess: false,
   },
   {
      name: 'Array Fail: too long',
      data: { tags: ['a', 'b', 'c', 'd', 'e'] },
      expectSuccess: false,
   },
   {
      name: 'Array Fail: missing include',
      data: { tags: ['react', 'vue'] },
      expectSuccess: false,
   },
   {
      name: 'Array Fail: not an array',
      data: { tags: 'not-an-array' },
      expectSuccess: false,
   },
]

console.log('--- TESTING ARRAY VALIDATOR (MODULAR) ---\n')

testCases.forEach((tc) => {
   const result = validate(tc.data, schema)
   if (result.success === tc.expectSuccess) {
      console.log(`✅ PASSED: ${tc.name}`)
   } else {
      console.log(`❌ FAILED: ${tc.name}`)
      console.log('Errors:', JSON.stringify(result.errors, null, 2))
   }
})

console.log('\n--- TESTS FINISHED ---')
