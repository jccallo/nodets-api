import { Request, Response, NextFunction } from 'express'
import { AppError } from './app-error'
import { HttpStatus } from '@/shared/http-status'

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
   // Errores controlados
   if (err instanceof AppError) {
      if (typeof err.payload === 'string') {
         return res.status(err.statusCode).json({
            message: err.payload,
            code: err.statusCode,
         })
      }

      return res.status(err.statusCode).json({
         errors: err.payload,
         code: err.statusCode,
      })
   }

   // Errores inesperados
   console.error('***************************')
   console.error('***** UNHANDLED ERROR *****')
   console.error('***************************')
   console.error(err)
   console.error('***************************')
   console.error('***************************')
   console.error('***************************')

   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
   })
}
