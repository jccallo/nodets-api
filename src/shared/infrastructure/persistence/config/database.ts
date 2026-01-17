import { env } from '@/shared/env'
import { Knex } from 'knex'

export const connections: { [key: string]: Knex.Config } = {
   mysql: {
      client: 'mysql2',
      connection: {
         host: env.db.host,
         user: env.db.user,
         password: env.db.password,
         database: env.db.name,
         port: env.db.port,
      },
      migrations: {
         directory: './src/shared/infrastructure/persistence/migrations',
         extension: 'ts',
      },
   },
   firebird: {
      client: 'knex-firebird-dialect',
      connection: {
         host: env.db.host,
         user: env.db.user,
         password: env.db.password,
         database: env.db.name,
         port: 3050,
      },
      useNullAsDefault: true,
      migrations: {
         directory: './src/shared/infrastructure/persistence/migrations',
         extension: 'ts',
      },
   },
}

export const dbConfig = connections[env.db.connection || 'mysql']
