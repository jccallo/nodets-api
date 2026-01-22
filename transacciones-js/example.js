import { DB } from './db.js'

/**
 * Ejemplo de uso en un servicio o caso de uso.
 */
async function crearPedidoCompleto(datosUsuario, datosPedido) {
   try {
      // 1. Iniciamos la transacción
      await DB.transaction(async () => {
         // 2. Insertamos el usuario
         // Gracias al Proxy, esto usa la transacción internamente
         const [userId] = await DB.table('users').insert({
            nombre: datosUsuario.nombre,
            email: datosUsuario.email,
         })

         // 3. Insertamos el pedido usando el ID anterior
         // Esto también usa la misma transacción automáticamente
         await DB.table('orders').insert({
            user_id: userId,
            total: datosPedido.total,
            fecha: new Date(),
         })

         console.log('✅ Todo se guardó correctamente en la DB')
      })
   } catch (error) {
      // 4. Si algo falló arriba, Knex hizo ROLLBACK y llegamos aquí
      console.error('❌ Error en el proceso. No se guardó nada:', error.message)
   }
}

// Ejemplo de llamada
// crearPedidoCompleto({ nombre: 'Juan', email: 'juan@test.com' }, { total: 150.50 });
