import { db } from './connection'
import { KnexUnitOfWork } from './knex-unit-of-work'

export const unitOfWork = new KnexUnitOfWork(db)
