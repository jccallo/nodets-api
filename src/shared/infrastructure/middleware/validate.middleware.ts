import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'
import { AppError } from '@/shared/errors'
import { HttpStatus } from '@/shared/http-status'

export const validate = (schema: z.ZodSchema) => {
   return async (req: Request, _res: Response, next: NextFunction) => {
      try {
         await schema.parseAsync(req.body)
         next()
      } catch (error) {
         if (error instanceof ZodError) {
            // Formato agrupado: { field: [error1, error2] }
            const details = error.issues.reduce((acc, err) => {
               const field = err.path.join('.')
               if (!acc[field]) acc[field] = []
               acc[field].push(err.message)
               return acc
            }, {} as Record<string, string[]>)

            throw new AppError(details, HttpStatus.BAD_REQUEST)
         }
         next(error)
      }
   }
}
