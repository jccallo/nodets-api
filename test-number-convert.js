const { validate, number } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const schema = {
   pureNumber: number(),
   convertedInteger: number().convert(0, 'round'),
   convertedTruncated: number().convert(1, 'trunc'),
   fromString: number().convert(),
}

const data = {
   pureNumber: '10', // Debería quedarse como string "10"
   convertedInteger: 10.6, // Debería ser 11 (numero)
   convertedTruncated: 10.678, // Debería ser 10.6 (numero)
   fromString: '123.456', // Debería ser 123.45 (numero, default 2 trunc)
}

const result = validate(data, schema)

console.log('--- TEST: Number + Convert ---')
console.log('Original "10" (pure):', result.data.pureNumber, typeof result.data.pureNumber)
console.log('Original 10.6 (convert(0, "round")):', result.data.convertedInteger, typeof result.data.convertedInteger)
console.log(
   'Original 10.678 (convert(1, "trunc")):',
   result.data.convertedTruncated,
   typeof result.data.convertedTruncated,
)
console.log('Original "123.456" (convert()):', result.data.fromString, typeof result.data.fromString)

// Verificaciones
if (typeof result.data.pureNumber === 'string') console.log('✅ pureNumber se mantiene como String')
if (result.data.convertedInteger === 11) console.log('✅ convertedInteger es 11')
if (result.data.convertedTruncated === 10.6) console.log('✅ convertedTruncated es 10.6')
if (result.data.fromString === 123.45) console.log('✅ fromString es 123.45 (Number)')
