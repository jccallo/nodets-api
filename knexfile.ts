import type { Knex } from 'knex'
import { dbConfig } from './src/shared/infrastructure/persistence/database'

const knexConfig: { [key: string]: Knex.Config } = {
   development: dbConfig,
   production: dbConfig,
}

export default knexConfig
