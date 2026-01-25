const { validate, boolean } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const schemaVal = { active: boolean() }
const schemaConv = { active: boolean().convert() }

const testCases = [
   { label: 'true (Boolean)', val: true, shouldPass: true, expectedConv: true, typeConv: 'boolean' },
   { label: 'false (Boolean)', val: false, shouldPass: true, expectedConv: false, typeConv: 'boolean' },
   { label: '"true" (String)', val: 'true', shouldPass: true, expectedConv: true, typeConv: 'boolean' },
   { label: '"false" (String)', val: 'false', shouldPass: true, expectedConv: false, typeConv: 'boolean' },
   { label: '1 (Number)', val: 1, shouldPass: true, expectedConv: 1, typeConv: 'number' },
   { label: '0 (Number)', val: 0, shouldPass: true, expectedConv: 0, typeConv: 'number' },
   { label: '"1" (String)', val: '1', shouldPass: true, expectedConv: 1, typeConv: 'number' },
   { label: '"0" (String)', val: '0', shouldPass: true, expectedConv: 0, typeConv: 'number' },
   { label: '2 (Number)', val: 2, shouldPass: false },
   { label: '"true " (Con espacio)', val: 'true ', shouldPass: false },
   { label: 'null', val: null, shouldPass: false },
]

console.log('=== PRUEBA DE LÓGICA MIXTA BOOLEAN-VALIDATOR ===\n')

testCases.forEach((item) => {
   // Probar Validación
   const resVal = validate({ active: item.val }, schemaVal)
   const valStatus = resVal.success === item.shouldPass ? '✅' : '❌'

   let convStatus = ''
   if (resVal.success && item.shouldPass) {
      // Probar Conversión
      const resConv = validate({ active: item.val }, schemaConv)
      const valConv = resConv.data.active
      const typeConv = typeof valConv

      if (valConv === item.expectedConv && typeConv === item.typeConv) {
         convStatus = `| Conv: OK (${valConv} as ${typeConv}) ✅`
      } else {
         convStatus = `| Conv: ERROR (Got ${valConv} as ${typeConv}, expected ${item.expectedConv} as ${item.typeConv}) ❌`
      }
   }

   console.log(`${valStatus} ${item.label.padEnd(20)}: Validated = ${resVal.success} ${convStatus}`)
})

console.log('\n=== PRUEBA FINALIZADA ===')
