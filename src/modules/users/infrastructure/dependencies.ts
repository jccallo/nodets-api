import { db } from '../../../shared/infrastructure/persistence/mysql/connection'
import { MySQLUserRepository } from './persistence/mysql/mysql-user.repository'
import { CreateUserUseCase } from '../application/use-cases/commands/create-user.use-case'
import { UpdateUserUseCase } from '../application/use-cases/commands/update-user.use-case'
import { DeleteUserUseCase } from '../application/use-cases/commands/delete-user.use-case'
import { GetUserByIdUseCase } from '../application/use-cases/queries/get-user-by-id.use-case'
import { GetAllUsersUseCase } from '../application/use-cases/queries/get-all-users.use-case'
import { UserSubscriber } from '../application/subscribers/user.subscriber'

export const userRepository = new MySQLUserRepository(db)

export const createUserUseCase = new CreateUserUseCase(userRepository)
export const updateUserUseCase = new UpdateUserUseCase(userRepository)
export const deleteUserUseCase = new DeleteUserUseCase(userRepository)
export const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
export const getAllUsersUseCase = new GetAllUsersUseCase(userRepository)

// Inicializar subscriber
new UserSubscriber()
