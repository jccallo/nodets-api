import knex from 'knex'
import { TransactionContext } from './transaction-context.js'

// --- CONFIGURACIÓN DE EJEMPLO ---
// Cambia esto por tus datos reales o impórtalos de un .env
const dbConfig = {
   client: 'mysql2',
   connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'mi_base_de_datos',
   },
}

export const knexInstance = knex(dbConfig)

/**
 * Proxy que intercepta las llamadas a Knex.
 * Si detecta una transacción en el contexto actual, la usa automáticamente.
 */
export const db = new Proxy(knexInstance, {
   get(target, prop) {
      const trx = TransactionContext.get()

      if (trx) {
         // Si hay una transacción activa, extraemos la propiedad (ej. 'table' o 'raw') de ella
         const value = trx[prop]
         if (typeof value === 'function') {
            return value.bind(trx)
         }
         return value
      }

      // Si no hay transacción, usamos la instancia global de knex
      const value = target[prop]
      if (typeof value === 'function') {
         return value.bind(target)
      }
      return value
   },
   apply(target, thisArg, argArray) {
      const trx = TransactionContext.get()
      if (trx) {
         return trx(...argArray)
      }
      return target(...argArray)
   },
})
