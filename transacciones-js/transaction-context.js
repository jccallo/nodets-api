import { AsyncLocalStorage } from 'async_hooks'

/**
 * Almacén para guardar la transacción de Knex en el contexto asíncrono actual.
 */
export class TransactionContext {
   static storage = new AsyncLocalStorage()

   /**
    * Ejecuta un callback dentro de un contexto con una transacción específica.
    * @param {Object} trx - Instancia de transacción de Knex.
    * @param {Function} callback - Función asíncrona a ejecutar.
    */
   static run(trx, callback) {
      return this.storage.run(trx, callback)
   }

   /**
    * Obtiene la transacción del contexto actual, si existe.
    * @returns {Object|undefined}
    */
   static get() {
      return this.storage.getStore()
   }
}
