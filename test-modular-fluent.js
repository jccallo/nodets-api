const {
   string,
   optional,
   nullable,
   validate,
} = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const schema = {
   bio: optional().nullable().string(),
   note: string().nullable().optional(),
}

const testCases = [
   {
      name: 'Modular Choice: Both Null',
      data: { bio: null, note: null },
      expectSuccess: true,
      verify: (data) => data.bio === null && data.note === null,
   },
   {
      name: 'Modular Choice: Both Missing',
      data: {},
      expectSuccess: true,
      verify: (data) => !('bio' in data) && !('note' in data),
   },
   {
      name: 'Modular Choice: Order proof (string first)',
      data: { note: 'hello' },
      expectSuccess: true,
   },
]

console.log('--- TESTING MODULAR FLUENT API ---\n')

testCases.forEach((tc) => {
   const result = validate(tc.data, schema)
   let passed = result.success === tc.expectSuccess
   if (passed && tc.verify && !tc.verify(result.data)) passed = false

   if (passed) {
      console.log(`✅ PASSED: ${tc.name}`)
   } else {
      console.log(`❌ FAILED: ${tc.name}`)
      console.log('Data:', JSON.stringify(result.data, null, 2))
   }
})
