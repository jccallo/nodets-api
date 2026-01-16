import { Router } from 'express'
import { validate } from '@/shared/infrastructure/middleware/validate.middleware'
import { loginSchema } from '@/modules/auth/application/dto'
import { authController } from '@/shared/services'

const router = Router()

// Controller resolved from global services

// Routes
router.post('/login', validate(loginSchema), authController.login)

export { router as authRoutes }
