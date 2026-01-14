import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../../shared/infrastructure/middleware/validate.middleware'
import { loginSchema } from '../application/dto'
import { LoginUseCase } from '../application/use-cases'
import { MySQLUserRepository } from '../../users/infrastructure/mysql-user.repository'

const router = Router()

// Repository (reutilizamos el de users)
const userRepository = new MySQLUserRepository()

// Use Cases
const loginUseCase = new LoginUseCase(userRepository)

// Controller
const authController = new AuthController(loginUseCase)

// Routes
router.post('/login', validate(loginSchema), authController.login)

export { router as authRoutes }
