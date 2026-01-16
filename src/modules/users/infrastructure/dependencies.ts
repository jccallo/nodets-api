import { db } from '@/shared/infrastructure/persistence/mysql/connection'
import { MySQLUserRepository } from '@/modules/users/infrastructure/persistence/mysql/mysql-user.repository'
import { CreateUserUseCase } from '@/modules/users/application/use-cases/commands/create-user.use-case'
import { UpdateUserUseCase } from '@/modules/users/application/use-cases/commands/update-user.use-case'
import { DeleteUserUseCase } from '@/modules/users/application/use-cases/commands/delete-user.use-case'
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/queries/get-user-by-id.use-case'
import { GetAllUsersUseCase } from '@/modules/users/application/use-cases/queries/get-all-users.use-case'
import { UserSubscriber } from '@/modules/users/application/subscribers/user.subscriber'
import { UserController } from '@/modules/users/ui/user.controller'

export const userRepository = new MySQLUserRepository(db)

export const createUserUseCase = new CreateUserUseCase(userRepository)
export const updateUserUseCase = new UpdateUserUseCase(userRepository)
export const deleteUserUseCase = new DeleteUserUseCase(userRepository)
export const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
export const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)

export const userController = new UserController()

// Inicializar subscriber
new UserSubscriber()
