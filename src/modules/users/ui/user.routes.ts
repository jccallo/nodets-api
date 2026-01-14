import { Router } from 'express'
import { UserController } from './user.controller'
import { UserService } from '../application/user.service'

const router = Router()
import { validate } from '../../../shared/infrastructure/middleware/validate.middleware'
import { createUserSchema } from '../domain/user.model'

const userService = new UserService()
const userController = new UserController(userService)

router.get('/', userController.getAll)
router.get('/external', userController.getExternalUsers)
router.get('/external-posts', userController.getExternalPosts)
router.post('/login', userController.login)
router.post('/', validate(createUserSchema), userController.create)

export { router as userRoutes }
