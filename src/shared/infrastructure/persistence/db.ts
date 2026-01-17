import { Knex } from 'knex'
import { db, knexInstance } from './connection'
import { TransactionContext } from './transaction-context'
import { KnexPaginator, PaginationResult } from './knex-paginator'

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

   static async paginate<T>(params: {
      query: Knex.QueryBuilder
      page?: number
      limit?: number
   }): Promise<PaginationResult<T>> {
      return KnexPaginator.paginate<T>(params)
   }
}
