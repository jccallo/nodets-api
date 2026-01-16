import { Router } from 'express'
import { userController } from '@/shared/services'
import { validate } from '@/shared/infrastructure/middleware/validate.middleware'
import { createUserSchema, updateUserSchema } from '@/modules/users/application/dto'
import { authMiddleware } from '@/shared/infrastructure/middleware/auth.middleware'

const router = Router()

// Controller resolved from global services

// Public routes
router.post('/', validate(createUserSchema), userController.create)

// Protected routes
router.use(authMiddleware)

router.get('/', userController.getAll)
router.get('/:id', userController.getById)
router.put('/:id', validate(updateUserSchema), userController.update)
router.delete('/:id', userController.delete)

export { router as userRoutes }
