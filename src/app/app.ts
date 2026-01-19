import cors from 'cors'
import express from 'express'
import { registerRoutes } from '@/app/routes'
import { notFoundHandler } from '@/shared/domain/exceptions'
import { errorHandler } from '@/shared/domain/exceptions/error-handler'

export function createApp() {
   const app = express()

   // Middlewares base
   app.use(cors())
   app.use(express.json())
   app.use(express.static('public'))

   // Rutas de la aplicación
   registerRoutes(app)

   app.use(notFoundHandler) // Middleware para rutas no encontradas (404)
   app.use(errorHandler) // Middleware para manejo de errores

   return app
}
