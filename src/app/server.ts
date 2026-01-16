import http from 'http'
import { Server } from 'socket.io'
import { createApp } from './app'
import { registerSocketHandler } from '../modules/chat/infrastructure/socket.handler'

export function startServer(port: number) {
   const app = createApp()
   const server = http.createServer(app)

   // Configurar Socket.IO con CORS habilitado
   const io = new Server(server, {
      cors: {
         origin: '*', // En producción, restringir a dominios permitidos
         methods: ['GET', 'POST'],
      },
   })

   // Registrar manejadores de socket
   registerSocketHandler(io)

   server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`)
      console.log(`⚡ Socket.IO ready`)
   })
}
