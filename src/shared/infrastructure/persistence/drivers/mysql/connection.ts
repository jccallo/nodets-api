import knex from 'knex'
import config from './knex-config'
import { env } from '@/shared/env'

import { TransactionContext } from '@/shared/infrastructure/persistence/transaction-context'

const knexInstance = knex(config[env.nodeEnv] || config.development)

export const db = new Proxy(knexInstance, {
   get(target, prop) {
      const trx = TransactionContext.get()

      if (trx) {
         // Si es una llamada directa como db('table') -> trx('table')
         // Si es una propiedad como db.raw -> trx.raw
         const value = trx[prop as keyof typeof trx]
         if (typeof value === 'function') {
            return value.bind(trx)
         }
         return value
      }

      const value = target[prop as keyof typeof target]
      if (typeof value === 'function') {
         return value.bind(target)
      }
      return value
   },
   apply(target, thisArg, argArray) {
      const trx = TransactionContext.get()
      if (trx) {
         return (trx as any)(...argArray)
      }
      return (target as any)(...argArray)
   },
}) as unknown as typeof knexInstance
