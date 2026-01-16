import { Server, Socket } from 'socket.io'

export function registerSocketHandler(io: Server) {
   io.on('connection', (socket: Socket) => {
      console.log('⚡ Usuario conectado:', socket.id)

      // Unirse a una sala "general" por defecto
      socket.join('general')

      // Escuchar mensajes del cliente
      socket.on('chat:message', (payload: { user: string; message: string }) => {
         console.log(`💬 ${payload.user}: ${payload.message}`)

         // Reenviar a todos en la sala "general" (incluyendo al remitente)
         io.to('general').emit('chat:message', payload)
      })

      socket.on('disconnect', () => {
         console.log('❌ Usuario desconectado:', socket.id)
      })
   })
}
