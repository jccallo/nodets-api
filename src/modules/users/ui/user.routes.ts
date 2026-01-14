import { Router } from 'express'
import { UserController } from './user.controller'
import { UserService } from '../application/user.service'
import { validate } from '../../../shared/infrastructure/middleware/validate.middleware'
import { createUserSchema, updateUserSchema } from '../domain/user.model'
import { MySQLUserRepository } from '../infrastructure/mysql-user.repository'

import { authMiddleware } from '@/shared/infrastructure/middleware/auth.middleware'

const router = Router()

const userRepository = new MySQLUserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

router.post('/login', userController.login)
router.post('/', validate(createUserSchema), userController.create)

// Protected routes
router.use(authMiddleware)

router.get('/', userController.getAll)
router.get('/:id', userController.getById)
router.put('/:id', validate(updateUserSchema), userController.update)
router.delete('/:id', userController.delete)

export { router as userRoutes }
