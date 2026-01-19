import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@/shared/env'
import { AppError } from '@/shared/domain/exceptions/app-error'
import { HttpStatus } from '@/shared/http-status'

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
   const authHeader = req.headers.authorization

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No se proporcionó un token de autenticación', HttpStatus.UNAUTHORIZED)
   }

   const token = authHeader.split(' ')[1]

   try {
      const decoded = jwt.verify(token, env.jwtSecret)
      ;(req as any).user = decoded
      next()
   } catch (error) {
      throw new AppError('Token de autenticación inválido o expirado', HttpStatus.UNAUTHORIZED)
   }
}
