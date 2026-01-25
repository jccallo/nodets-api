const {
   validate,
   boolean,
   optional,
   nullable,
} = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const schema = {
   active: boolean(),
}

const testValues = [
   { label: '"1" (String)', val: '1' },
   { label: '"0" (String)', val: '0' },
   { label: '1 (Number)', val: 1 },
   { label: '0 (Number)', val: 0 },
   { label: 'null', val: null },
   { label: 'undefined', val: undefined },
   { label: '"true" (String)', val: 'true' },
]

console.log('=== PRUEBA DE VALORES NO BOOLEANOS EN BOOLEAN-VALIDATOR ===\n')

testValues.forEach((item) => {
   const result = validate({ active: item.val }, schema)
   console.log(
      `${item.label}: Success = ${result.success}${result.errors ? ' | Error: ' + JSON.stringify(result.errors.active) : ''}`,
   )
})

console.log('\n--- PRUEBA CON OPTIONAL/NULLABLE ---')
const schemaFlex = {
   opt: optional().boolean(),
   nulla: nullable().boolean(),
}

console.log('undefined in optional:', validate({}, schemaFlex).success)
console.log('null in nullable:', validate({ nulla: null }, schemaFlex).success)
