const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const schema = {
   schedule: date().start('08:00').end('17:00'),
}

const data = { schedule: '2024-01-01 10:00:00' }
const result = validate(data, schema)

console.log('Input:', data.schedule)
console.log('Success:', result.success)
if (result.errors) console.log('Errors:', JSON.stringify(result.errors))
