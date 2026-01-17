import { Knex } from 'knex'
import { UnitOfWork } from '@/shared/domain/persistence/unit-of-work.interface'
import { TransactionContext } from '@/shared/infrastructure/persistence/transaction-context'

export class KnexUnitOfWork implements UnitOfWork {
   constructor(private readonly db: Knex) {}

   async transaction<T>(work: () => Promise<T>): Promise<T> {
      return this.db.transaction(async (trx) => {
         return TransactionContext.run(trx, work)
      })
   }
}
