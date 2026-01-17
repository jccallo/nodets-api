import { env } from '@/shared/env'
import { Knex } from 'knex'

export const connections: { [key: string]: Knex.Config } = {
   mysql: {
      client: 'mysql2',
      connection: {
         host: env.mysql.host,
         user: env.mysql.user,
         password: env.mysql.password,
         database: env.mysql.name,
         port: env.mysql.port,
      },
      migrations: {
         directory: './src/shared/infrastructure/persistence/migrations/mysql',
         extension: 'ts',
      },
   },
   firebird: {
      client: 'knex-firebird-dialect',
      connection: {
         host: env.firebird.host,
         user: env.firebird.user,
         password: env.firebird.password,
         database: env.firebird.database,
         port: env.firebird.port,
      },
      useNullAsDefault: true,
      migrations: {
         directory: './src/shared/infrastructure/persistence/migrations/firebird',
         extension: 'ts',
      },
   },
}

export const dbConfig = connections[env.dbConnection || 'mysql']
