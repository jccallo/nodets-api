import knex from 'knex'
import { dbConfig } from './src/shared/infrastructure/persistence/database'
import { ulid } from 'ulid'

const db = knex(dbConfig)

async function runBenchmark() {
   const COUNT = 5000

   console.log(`--- Iniciando Benchmark (${COUNT} registros) ---`)

   // 1. Limpieza y Creación de Tablas
   await db.schema.dropTableIfExists('benchmark_int')
   await db.schema.dropTableIfExists('benchmark_ulid')

   await db.schema.createTable('benchmark_int', (table) => {
      table.increments('id').primary()
      table.string('data')
   })

   await db.schema.createTable('benchmark_ulid', (table) => {
      table.string('id', 26).primary()
      table.string('data')
   })

   // 2. Test de Inserción INT
   console.log('Insertando en INT...')
   const startInsertInt = Date.now()
   for (let i = 0; i < COUNT; i++) {
      await db('benchmark_int').insert({ data: 'some random data ' + i })
   }
   const endInsertInt = Date.now()
   console.log(`INT Inserción: ${endInsertInt - startInsertInt}ms`)

   // 3. Test de Inserción ULID
   console.log('Insertando en ULID...')
   const ulidList: string[] = []
   const startInsertUlid = Date.now()
   for (let i = 0; i < COUNT; i++) {
      const id = ulid()
      ulidList.push(id)
      await db('benchmark_ulid').insert({ id, data: 'some random data ' + i })
   }
   const endInsertUlid = Date.now()
   console.log(`ULID Inserción: ${endInsertUlid - startInsertUlid}ms`)

   // 4. Test de Búsqueda INT
   console.log('Buscando en INT...')
   const startSelectInt = Date.now()
   for (let i = 0; i < 1000; i++) {
      const randomId = Math.floor(Math.random() * COUNT) + 1
      await db('benchmark_int').where('id', randomId).first()
   }
   const endSelectInt = Date.now()
   console.log(`INT Búsqueda (1000 selects): ${endSelectInt - startSelectInt}ms`)

   // 5. Test de Búsqueda ULID
   console.log('Buscando en ULID...')
   const startSelectUlid = Date.now()
   for (let i = 0; i < 1000; i++) {
      const randomId = ulidList[Math.floor(Math.random() * COUNT)]
      await db('benchmark_ulid').where('id', randomId).first()
   }
   const endSelectUlid = Date.now()
   console.log(`ULID Búsqueda (1000 selects): ${endSelectUlid - startSelectUlid}ms`)

   await db.destroy()
}

runBenchmark().catch(console.error)
