import { Router } from 'express'
import { UserWorkerController } from '@/modules/user-workers/ui/user-worker.controller'
import { validate } from '@/shared/infrastructure/middleware/validate.middleware'
import { MySQLUserWorkerRepository } from '@/modules/user-workers/infrastructure/mysql-user-worker.repository'
import {
   CreateUserWorkerUseCase,
   UpdateUserWorkerUseCase,
   DeleteUserWorkerUseCase,
   GetAllUserWorkersUseCase,
   GetUserWorkerByIdUseCase,
} from '@/modules/user-workers/application/use-cases'

import { authMiddleware } from '@/shared/infrastructure/middleware/auth.middleware'

import { db } from '@/shared/infrastructure/persistence/mysql/connection'

const router = Router()

// Repository
const userWorkerRepository = new MySQLUserWorkerRepository(db)

// Use Cases
const createUserWorkerUseCase = new CreateUserWorkerUseCase(userWorkerRepository)
const updateUserWorkerUseCase = new UpdateUserWorkerUseCase(userWorkerRepository)
const deleteUserWorkerUseCase = new DeleteUserWorkerUseCase(userWorkerRepository)
const getAllUserWorkersUseCase = new GetAllUserWorkersUseCase(userWorkerRepository)
const getUserWorkerByIdUseCase = new GetUserWorkerByIdUseCase(userWorkerRepository)

// Controller
const userWorkerController = new UserWorkerController(
   createUserWorkerUseCase,
   updateUserWorkerUseCase,
   deleteUserWorkerUseCase,
   getAllUserWorkersUseCase,
   getUserWorkerByIdUseCase
)

// Public routes
router.post('/', userWorkerController.create)

// Protected routes
router.use(authMiddleware)

router.get('/', userWorkerController.getAll)
router.get('/:id', userWorkerController.getById)
router.put('/:id', userWorkerController.update)
router.delete('/:id', userWorkerController.delete)

export { router as userWorkerRoutes }
