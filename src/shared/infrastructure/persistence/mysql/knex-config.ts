import type { Knex } from 'knex'
import { env } from '@/shared/env'

const config: { [key: string]: Knex.Config } = {
   development: {
      client: 'mysql2',
      connection: {
         host: env.db.host,
         user: env.db.user,
         password: env.db.password,
         database: env.db.name,
         port: env.db.port,
      },
      migrations: {
         directory: './src/shared/infrastructure/persistence/mysql/migrations',
         extension: 'ts',
      },
   },
}

export default config
