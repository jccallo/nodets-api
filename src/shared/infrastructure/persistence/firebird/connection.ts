import knex from 'knex'
import config from './knex-config'
import { env } from '../../../env'

export const firebirdDb = knex(config[env.nodeEnv] || config.development)
