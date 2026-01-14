import type { Knex } from 'knex'
import { env } from '../../../env'

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
         directory: './migrations',
         extension: 'ts',
      },
   },
}

export default config
