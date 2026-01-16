import knex from 'knex'
import config from '@/shared/infrastructure/persistence/firebird/knex-config'
import { env } from '@/shared/env'

export const firebirdDb = knex(config[env.nodeEnv] || config.development)
