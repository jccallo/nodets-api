import { Knex } from 'knex'
import { db, knexInstance } from './connection'
import { TransactionContext } from './transaction-context'

export class DB {
   static table<TRecord extends {} = any, TResult = unknown[]>(tableName: string): Knex.QueryBuilder<TRecord, TResult> {
      return db(tableName)
   }

   static raw(sql: string, bindings: Knex.RawBinding = []): Knex.Raw {
      return db.raw(sql, bindings)
   }

   static async transaction<T>(callback: () => Promise<T>): Promise<T> {
      return knexInstance.transaction(async (trx) => {
         return TransactionContext.run(trx, callback)
      })
   }
}
