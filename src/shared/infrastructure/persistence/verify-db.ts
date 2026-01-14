import { pool } from './mysql-connection'

async function verifyConnection() {
  console.log('Intentando conectar a MySQL...')
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS result')
    console.log('✅ Conexión exitosa. Resultado de prueba:', (rows as any)[0].result)

    // Verificar si la tabla users existe
    const [tableRows] = await pool.execute("SHOW TABLES LIKE 'users'")
    if ((tableRows as any[]).length > 0) {
      console.log('✅ La tabla "users" existe.')
    } else {
      console.log('⚠️ La tabla "users" no existe. Debes crearla.')
    }
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error)
  } finally {
    await pool.end()
  }
}

verifyConnection()
