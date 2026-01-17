import dotenv from 'dotenv'
import path from 'path'

// Se utiliza una ruta absoluta para garantizar que el archivo .env se cargue correctamente:
// - __dirname: Es la ruta absoluta de la carpeta donde reside este archivo (src/shared).
// - '../../.env': Sube dos niveles hasta la raíz del proyecto para localizar el archivo .env.
// Esto evita errores cuando se ejecutan comandos como Knex CLI desde otros directorios.
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const env = {
   port: Number(process.env.PORT) || 3000,
   nodeEnv: process.env.NODE_ENV || 'development',
   db: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      name: process.env.DB_NAME || 'test',
      port: Number(process.env.DB_PORT) || 3306,
   },
   firebird: {
      host: process.env.FB_HOST || '127.0.0.1',
      user: process.env.FB_USER || 'SYSDBA',
      password: process.env.FB_PASSWORD || 'masterkey',
      database: process.env.FB_DATABASE || '/path/to/db.fdb',
      port: Number(process.env.FB_PORT) || 3050,
   },
   jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
   redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
   },
}
