import { Knex } from 'knex'
import { UnitOfWork } from '@/shared/domain/unit-of-work.interface'

export class KnexUnitOfWork implements UnitOfWork {
   constructor(private readonly db: Knex) {}

   async transaction<T>(work: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
      return this.db.transaction(async (trx) => {
         return await work(trx)
      })
   }
}
