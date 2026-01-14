import { Router } from 'express'
import { UserController } from './user.controller'
import { validate } from '../../../shared/infrastructure/middleware/validate.middleware'
import { createUserSchema, updateUserSchema } from '../application/dto'
import { MySQLUserRepository } from '../infrastructure/mysql-user.repository'
import {
   CreateUserUseCase,
   UpdateUserUseCase,
   DeleteUserUseCase,
   GetAllUsersUseCase,
   GetUserByIdUseCase,
} from '../application/use-cases'

import { authMiddleware } from '@/shared/infrastructure/middleware/auth.middleware'

const router = Router()

// Repository
const userRepository = new MySQLUserRepository()

// Use Cases
const createUserUseCase = new CreateUserUseCase(userRepository)
const updateUserUseCase = new UpdateUserUseCase(userRepository)
const deleteUserUseCase = new DeleteUserUseCase(userRepository)
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)

// Controller
const userController = new UserController(
   createUserUseCase,
   updateUserUseCase,
   deleteUserUseCase,
   getAllUsersUseCase,
   getUserByIdUseCase
)

// Public routes
router.post('/', validate(createUserSchema), userController.create)

// Protected routes
router.use(authMiddleware)

router.get('/', userController.getAll)
router.get('/:id', userController.getById)
router.put('/:id', validate(updateUserSchema), userController.update)
router.delete('/:id', userController.delete)

export { router as userRoutes }
