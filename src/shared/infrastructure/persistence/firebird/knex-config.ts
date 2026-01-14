import type { Knex } from 'knex'
import { env } from '../../../env'
import knexFirebirdDialect from 'knex-firebird-dialect'

const config: { [key: string]: Knex.Config } = {
   development: {
      client: knexFirebirdDialect as any,
      connection: {
         host: env.firebird.host,
         user: env.firebird.user,
         password: env.firebird.password,
         database: env.firebird.database,
         port: env.firebird.port,
      },
      migrations: {
         directory: './migrations',
         extension: 'ts',
      },
   },
}

export default config
