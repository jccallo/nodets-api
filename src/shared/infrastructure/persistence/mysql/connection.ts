import knex from 'knex'
import config from './knex-config'
import { env } from '../../../env'

export const db = knex(config[env.nodeEnv] || config.development)
