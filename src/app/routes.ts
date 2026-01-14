import type { Express, Request, Response } from 'express'
import { userRoutes } from '../modules/users/ui/user.routes'
import { HttpStatus } from '../shared/http-status'

export function registerRoutes(app: Express) {
  app.get('/health', (_req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({ status: 'UP' })
  })

  app.use('/users', userRoutes)
}
