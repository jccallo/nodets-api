import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../../shared/infrastructure/middleware/validate.middleware'
import { loginSchema } from '../application/dto'
import { LoginUseCase } from '../application/use-cases'
import { container } from 'tsyringe'

const router = Router()

// Controller resolved by container
const authController = container.resolve(AuthController)

// Routes
router.post('/login', validate(loginSchema), authController.login)

export { router as authRoutes }
