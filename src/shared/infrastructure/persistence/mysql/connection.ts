import knex from 'knex'
import config from '@/shared/infrastructure/persistence/mysql/knex-config'
import { env } from '@/shared/env'

export const db = knex(config[env.nodeEnv] || config.development)
