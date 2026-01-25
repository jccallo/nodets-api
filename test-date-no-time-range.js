const { validate, date } = require('./src/shared/infrastructure/validation/easy-validator/index.js')

const runTest = (name, data, schema) => {
   const result = validate(data, schema)
   console.log(
      `${name}: Success = ${result.success}${result.errors ? ' | Errors: ' + JSON.stringify(result.errors) : ''}`,
   )
   return result
}

console.log('=== PRUEBA DE FECHAS SIN HORA EN RANGOS ===\n')

// Escenario: Rango de un día completo usando solo fecha en los límites
const schemaOnlyDate = {
   appointment: date().start('2024-01-01').end('2024-01-01'),
}

console.log('--- Caso: start("2024-01-01").end("2024-01-01") ---')
// Si mando 2024-01-01 exacto
runTest('Input: "2024-01-01"', { appointment: '2024-01-01' }, schemaOnlyDate)
// Si mando con hora (ya no debería pasar si el rango es exacto a medianoche)
runTest('Input: "2024-01-01 10:00:00"', { appointment: '2024-01-01 10:00:00' }, schemaOnlyDate)

console.log('\n--- Caso: Rango inclusivo tradicional ---')
const schemaTraditional = {
   range: date().start('2024-01-01').end('2024-01-02'),
}
runTest('Input: "2024-01-01 12:00:00" en start("2024-01-01")', { range: '2024-01-01 12:00:00' }, schemaTraditional)
