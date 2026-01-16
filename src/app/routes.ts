import type { Express, Request, Response } from 'express'
import { userRoutes } from '@/modules/users/ui/user.routes'
import { authRoutes } from '@/modules/auth/ui/auth.routes'
import { postRoutes } from '@/modules/posts/ui/post.routes'
import { HttpStatus } from '@/shared/http-status'

export function registerRoutes(app: Express) {
   app.get('/health', (_req: Request, res: Response) => {
      res.status(HttpStatus.OK).json({ status: 'UP' })
   })

   app.use('/auth', authRoutes)
   app.use('/users', userRoutes)
   app.use('/posts', postRoutes)
}
