const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

console.log('=== PRUEBA DE CONVERSIÓN DE ZONAS HORARIAS ===\n')

// Entrada: 8 PM UTC (Nochevieja)
const input = '2024-12-31 20:00:00'
const data = {
   original: input,
   lima: input,
   madrid: input,
   utc: input,
}

const schema = {
   original: date(), // Sin conversión
   lima: date().convert('America/Lima'), // UTC-5 (3 PM)
   madrid: date().convert('Europe/Madrid'), // UTC+1 (9 PM)
   utc: date().convert('UTC'),
}

const result = validate(data, schema)

console.log('Entrada original (UTC):', data.registro)
console.log('--- Resultados de Conversión ---')
console.log('Lima (America/Lima):  ', result.data.lima, typeof result.data.lima)
console.log('Madrid (Europe/Madrid):', result.data.madrid, typeof result.data.madrid)
console.log('UTC (Forzado):        ', result.data.utc, typeof result.data.utc)
console.log('Sin convert (Tipo):   ', typeof result.data.original)

// Verificaciones automáticas
const passed =
   result.data.lima === '2024-12-31 15:00:00' &&
   result.data.madrid === '2024-12-31 21:00:00' &&
   typeof result.data.lima === 'string'

if (passed) {
   console.log('\n✅ TEST PASSED: Zonas horarias y formato correctos.')
} else {
   console.log('\n❌ TEST FAILED: Verifique los valores de salida.')
}
