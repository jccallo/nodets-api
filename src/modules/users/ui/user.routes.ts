import { Router } from 'express'
import { container } from 'tsyringe'
import { UserController } from '@/modules/users/ui/user.controller'
import { validate } from '@/shared/infrastructure/middleware/validate.middleware'
import { createUserSchema, updateUserSchema } from '@/modules/users/application/dto'
import { authMiddleware } from '@/shared/infrastructure/middleware/auth.middleware'

const router = Router()
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
