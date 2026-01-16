import { db } from '@/shared/infrastructure/persistence/mysql/connection'

async function verifyConnection() {
   try {
      const result = await db.raw('SELECT 1 + 1 AS result')
      console.log('✅ Conexión a MySQL exitosa con Knex (1 + 1 = ' + result[0][0].result + ')')

      const hasTable = await db.schema.hasTable('users')
      if (hasTable) {
         console.log('✅ La tabla "users" existe.')
      } else {
         console.log('❌ La tabla "users" no existe. Ejecuta las migraciones.')
      }
   } catch (error) {
      console.error('❌ Error al conectar a la base de datos:', error)
   } finally {
      await db.destroy()
   }
}

verifyConnection()
