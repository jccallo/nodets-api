import { Knex } from 'knex'
import { db } from './connection'

export class DB {
   static table<TRecord extends {} = any, TResult = unknown[]>(tableName: string): Knex.QueryBuilder<TRecord, TResult> {
      return db(tableName)
   }

   static raw(sql: string, bindings: Knex.RawBinding = []): Knex.Raw {
      return db.raw(sql, bindings)
   }
}
