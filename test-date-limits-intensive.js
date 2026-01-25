const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

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
      if (result.errors) console.log('   Errors:', JSON.stringify(result.errors))
   }
   return { passed, result }
}

console.log('=== TESTEO INTENSIVO: LÍMITES HÍBRIDOS (ABSOLUTOS Y RELATIVOS) ===\n')

// Escenario A: Absoluto vs Relativo
console.log('--- 1. Mezcla Absoluto (Start) y Relativo (End) ---')
const schemaMix1 = {
   event: date()
      .start('2024-01-01 00:00:00') // No antes de este año
      .end('18:00:00'), // Pero siempre antes de las 6 PM de ese día
}

runTest('Pasa: En 2024 a las 10 AM', { event: '2024-05-20 10:00:00' }, schemaMix1, true)
runTest('Falla: En 2024 pero a las 8 PM', { event: '2024-05-20 20:00:00' }, schemaMix1, false)
runTest('Falla: En 2023 aunque sea temprano', { event: '2023-12-31 10:00:00' }, schemaMix1, false)

// Escenario B: Relativo vs Absoluto
console.log('\n--- 2. Mezcla Relativo (Start) y Absoluto (End) ---')
const schemaMix2 = {
   event: date()
      .start('09:00:00') // Después de las 9 AM
      .end('2024-12-31 23:59:59'), // Hasta el fin de este año
}
runTest('Pasa: Hoy a las 11 AM', { event: '2024-10-10 11:00:00' }, schemaMix2, true)
runTest('Falla: Hoy a las 8 AM', { event: '2024-10-10 08:00:00' }, schemaMix2, false)
runTest('Falla: Próximo año 10 AM', { event: '2025-01-01 10:00:00' }, schemaMix2, false)

// Escenario C: El orden del CONVERT
console.log('\n--- 3. El Impacto del Orden de .convert() ---')

// Convert antes: El rango valida la hora de LIMA
const schemaLimaFirst = {
   event: date().convert('America/Lima').start('08:00:00').end('10:00:00'),
}

// Entrada: 1 PM UTC -> 8 AM Lima (Pasa)
runTest('Convert ANTES: 1 PM UTC (8 AM Lima) es válido', { event: '2024-01-01 13:00:00' }, schemaLimaFirst, true)

// Convert después: El rango valida la hora de entrada (UTC)
const schemaLimaLast = {
   event: date().start('08:00:00').end('10:00:00').convert('America/Lima'),
}
// Entrada: 1 PM UTC -> No está entre 8-10 AM (Falla la regla antes de convertir)
runTest('Convert DESPUÉS: 1 PM UTC falla la regla UTC', { event: '2024-01-01 13:00:00' }, schemaLimaLast, false)

console.log('\n=== TESTEO FINALIZADO ===')
