const { number, validate } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const schema = {
   age: number().minValue(18).maxValue(99),
   price: number().minValue(0.1),
   score: number().inList([1, 2, 3, 4, 5]),
}

const testCases = [
   {
      name: 'Number Coercion: Integer String',
      data: { age: '25', price: '10', score: '5' },
      expectSuccess: true,
      verify: (data) => typeof data.age === 'number' && data.age === 25,
   },
   {
      name: 'Number Precision: Decimal String to 2 places (Truncated)',
      data: { age: 30, price: '19.955', score: 4 },
      expectSuccess: true,
      verify: (data) => data.price === 19.95, // Should truncate to 19.95
   },
   {
      name: 'Number Range: minValue failure',
      data: { age: '17', price: '10', score: '5' },
      expectSuccess: false,
   },
   {
      name: 'Number Range: maxValue failure',
      data: { age: '100', price: '10', score: '5' },
      expectSuccess: false,
   },
   {
      name: 'Number List: inList failure',
      data: { age: '25', price: '10', score: '6' },
      expectSuccess: false,
   },
   {
      name: 'Number Invalid: Not a number string',
      data: { age: 'abc', price: '10', score: '5' },
      expectSuccess: false,
   },
]

console.log('--- TESTING NUMBER VALIDATOR (MODULAR) ---\n')

testCases.forEach((tc) => {
   const result = validate(tc.data, schema)
   let passed = result.success === tc.expectSuccess
   if (passed && tc.expectSuccess && tc.verify && !tc.verify(result.data)) passed = false

   if (passed) {
      console.log(`✅ PASSED: ${tc.name}`)
   } else {
      console.log(`❌ FAILED: ${tc.name}`)
      console.log('Errors:', JSON.stringify(result.errors, null, 2))
      console.log('Data:', JSON.stringify(result.data, null, 2))
   }
})

console.log('\n--- TESTS FINISHED ---')
