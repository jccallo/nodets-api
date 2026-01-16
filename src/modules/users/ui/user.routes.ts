import { Router } from 'express'
import { UserController } from './user.controller'
import { validate } from '../../../shared/infrastructure/middleware/validate.middleware'
import { createUserSchema, updateUserSchema } from '../application/dto'
import { authMiddleware } from '@/shared/infrastructure/middleware/auth.middleware'

import { container } from 'tsyringe'

const router = Router()

// Controller resolved by container
const userController = container.resolve(UserController)

// Public routes
router.post('/', validate(createUserSchema), userController.create)

// Protected routes
router.use(authMiddleware)

router.get('/', userController.getAll)
router.get('/:id', userController.getById)
router.put('/:id', validate(updateUserSchema), userController.update)
router.delete('/:id', userController.delete)

export { router as userRoutes }
