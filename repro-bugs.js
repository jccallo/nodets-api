const { validate, string, number } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

console.log('--- TEST 1: Crash when data is null ---')
try {
   const result = validate(null, { name: string() })
   console.log('Result:', result)
} catch (e) {
   console.log('❌ CRASHED as expected:', e.message)
}

console.log('\n--- TEST 2: Number transformation (truncation) ---')
const schemaNum = { price: number() }
const resNum = validate({ price: 123.456 }, schemaNum)
console.log('Original: 123.456, Validated:', resNum.data.price)
if (resNum.data.price === 123.45) {
   console.log('⚠️ TRUNCATED to 123.45 (potential unexpected behavior)')
}

console.log('\n--- TEST 3: Number rounding of "integers" ---')
// If I pass a float but it's passed as a number and converted to string without dot?
// No, String(10.0) is "10". But String(10.1) is "10.1".
const resInt = validate({ age: 25.9 }, { age: number() })
console.log('Original: 25.9, Validated:', resInt.data.age)

console.log('\n--- TEST 4: Empty string in required field ---')
const schemaReq = { bio: string() }
const resReq = validate({ bio: '' }, schemaReq)
console.log('Empty string result:', JSON.stringify(resReq.errors))
if (resReq.errors && resReq.errors.bio) {
   console.log('⚠️ Empty string treated as missing (cannot be mandatory but empty)')
}
