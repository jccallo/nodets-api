import { Request, Response, NextFunction } from 'express'
import { HttpStatus } from '../http-status'

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  res.status(HttpStatus.NOT_FOUND).json({
    message: `Ruta ${req.originalUrl} no encontrada`,
    code: HttpStatus.NOT_FOUND,
  })
}
