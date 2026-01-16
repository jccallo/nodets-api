import { Router } from 'express'
import { container } from 'tsyringe'
import { PostController } from './post.controller'
import { validate } from '../../../shared/infrastructure/middleware/validate.middleware'
import { createPostSchema } from '../application/dto/create-post.dto'
import { authMiddleware } from '../../../shared/infrastructure/middleware/auth.middleware'

const router = Router()
const postController = container.resolve(PostController)

router.use(authMiddleware)

router.post('/', validate(createPostSchema), (req, res, next) => {
   // Hack to extract user from request if middleware puts it there
   // For this example `req` type needs extension.
   // We will simulate getting user from request in controller for now.
   // But actually, let's pass it properly if we can.
   // authMiddleware should interpret token.
   postController.create(req, res).catch(next)
})

router.get('/user/:userId', (req, res, next) => {
   postController.getByUser(req, res).catch(next)
})

export { router as postRoutes }
