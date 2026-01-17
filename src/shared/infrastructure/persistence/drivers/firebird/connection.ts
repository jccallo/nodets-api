import knex from 'knex'
import { connections } from '@/shared/infrastructure/persistence/config/database'

export const firebirdDb = knex(connections.firebird)
