import { AsyncLocalStorage } from 'async_hooks'
import { Knex } from 'knex'

export class TransactionContext {
   private static storage = new AsyncLocalStorage<Knex.Transaction>()

   static run<T>(trx: Knex.Transaction, callback: () => Promise<T>): Promise<T> {
      return this.storage.run(trx, callback)
   }

   static get(): Knex.Transaction | undefined {
      return this.storage.getStore()
   }
}
