import { db, knexInstance } from './connection.js'
import { TransactionContext } from './transaction-context.js'

/**
 * Fachada para interactuar con la base de datos y gestionar transacciones.
 */
export class DB {
   /**
    * Inicia una consulta en una tabla.
    * @param {string} tableName
    */
   static table(tableName) {
      return db(tableName)
   }

   /**
    * Ejecuta una consulta SQL pura.
    * @param {string} sql
    * @param {Array} bindings
    */
   static raw(sql, bindings = []) {
      return db.raw(sql, bindings)
   }

   /**
    * Envuelve una serie de operaciones en una transacción.
    * Si el callback lanza un error, se hace ROLLBACK automáticamente.
    * @param {Function} callback - Función asíncrona con la lógica de negocio.
    */
   static async transaction(callback) {
      return knexInstance.transaction(async (trx) => {
         // Guardamos la transacción en el contexto antes de ejecutar el callback
         return TransactionContext.run(trx, callback)
      })
   }
}
