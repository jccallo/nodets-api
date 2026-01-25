const {
   validate,
   number,
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
      console.log('   Validated Data:', JSON.stringify(result.data))
   }
   return { passed, result }
}

console.log('=== INICIANDO TESTEO INTENSIVO DE NUMBER-VALIDATOR ===\n')

// 1. Tipos Básicos y Validación Pura (sin transformación)
console.log('--- 1. Validación Pura (Number vs String) ---')
const schemaPure = { age: number() }
runTest('Entero como Number', { age: 25 }, schemaPure, true)
runTest('Entero como String', { age: '25' }, schemaPure, true)
runTest('Decimal como Number', { age: 25.5 }, schemaPure, true)
runTest('Decimal como String', { age: '25.5' }, schemaPure, true)
runTest('Error: No numérico', { age: 'veinticinco' }, schemaPure, false)
runTest('Error: String vacío', { age: '' }, schemaPure, false)

// 2. Transformación con convert()
console.log('\n--- 2. Transformaciones con convert() ---')
const schemaConv = {
   price: number().convert(),
   qty: number().convert(0, 'round'),
   score: number().convert(1, 'trunc'),
}
const resConv = runTest(
   'Verificar transformaciones',
   { price: '45.678', qty: 10.6, score: 10.678 },
   schemaConv,
   true,
).result
if (resConv.data.price === 45.67) console.log('   ✅ price: "45.678" -> 45.67 (default 2, trunc)')
if (resConv.data.qty === 11) console.log('   ✅ qty: 10.6 -> 11 (0, round)')
if (resConv.data.score === 10.6) console.log('   ✅ score: 10.678 -> 10.6 (1, trunc)')

// 3. Límites (minValue, maxValue)
console.log('\n--- 3. Límites (min/max) ---')
const schemaLimits = { val: number().minValue(10).maxValue(20) }
runTest('Límites: Dentro de rango', { val: 15 }, schemaLimits, true)
runTest('Límites: Límite inferior', { val: 10 }, schemaLimits, true)
runTest('Límites: Límite superior', { val: 20 }, schemaLimits, true)
runTest('Límites: Fuera (bajo)', { val: 9.9 }, schemaLimits, false)
runTest('Límites: Fuera (alto)', { val: 20.1 }, schemaLimits, false)
runTest('Límites: String válido', { val: '15' }, schemaLimits, true)

// 4. Listas (inList)
console.log('\n--- 4. Listas (inList) ---')
const schemaList = { status: number().inList([1, 2, 3]) }
runTest('Lista: Incluido', { status: 2 }, schemaList, true)
runTest('Lista: Incluido como String', { status: '3' }, schemaList, true)
runTest('Lista: No incluido', { status: 4 }, schemaList, false)

// 5. Opcionales y Nullables
console.log('\n--- 5. Opcionales y Nullables ---')
const schemaOpt = {
   id: optional().number(),
   deleted: optional().nullable().number().convert(0),
}
runTest('Opcional: Presente', { id: 1 }, schemaOpt, true)
runTest('Opcional: Ausente', {}, schemaOpt, true)
runTest('Nullable: Null', { deleted: null, id: 5 }, schemaOpt, true)
runTest('Nullable: Presente', { deleted: '1' }, schemaOpt, true)

// 6. Combinación Compleja
console.log('\n--- 6. Combinación Compleja ---')
const schemaComplex = {
   amount: number().minValue(1).maxValue(5000).convert(2, 'round'),
}
const resComplex = runTest('Complejo: 123.456 -> 123.46', { amount: '123.456' }, schemaComplex, true).result
if (resComplex.data.amount === 123.46 && typeof resComplex.data.amount === 'number') {
   console.log('   ✅ Combinación exitosa de min/max/convert')
}

console.log('\n=== TESTEO FINALIZADO ===')
