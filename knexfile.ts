import type { Knex } from 'knex'
import config from './src/shared/infrastructure/persistence/mysql/knex-config'

const knexConfig: { [key: string]: Knex.Config } = config

export default knexConfig
