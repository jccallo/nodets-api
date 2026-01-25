const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const schema = { eventDate: date() }
const sample = '2024-12-31 22:23:09'
const result = validate({ eventDate: sample }, schema)

console.log(`Input: "${sample}"`)
console.log(`Success: ${result.success}`)
if (result.errors) console.log(`Errors: ${JSON.stringify(result.errors)}`)
else console.log(`Resulting Data: ${JSON.stringify(result.data)}`)

if (result.success) {
   console.log('✅ El formato con segundos es aceptado correctamente.')
} else {
   console.log('❌ El formato con segundos falló.')
}
