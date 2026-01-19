import knex from 'knex'
import { connections } from '@/shared/infrastructure/persistence/database'

const firebirdDb = knex(connections.firebird)

async function verifyFirebird() {
   try {
      // Intento de consulta simple en Firebird
      // Nota: Cambia RDB$DATABASE por una tabla real si es necesario
      const result = await firebirdDb.raw('SELECT 1 FROM RDB$DATABASE')
      console.log('✅ Conexión a Firebird exitosa con Knex')
   } catch (error) {
      console.error('❌ Error al conectar a Firebird:', error)
   } finally {
      await firebirdDb.destroy()
   }
}

verifyFirebird()
