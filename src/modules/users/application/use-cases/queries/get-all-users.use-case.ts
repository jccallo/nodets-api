import { UserRepository } from '../../../domain/repositories/user.repository'
import { User } from '../../../domain/entities/user.model'
import { AppError } from '../../../../../shared/errors/app-error'
import { HttpStatus } from '../../../../../shared/http-status'

export class GetAllUsersUseCase {
   constructor(private userRepository: UserRepository) {}

   async execute(): Promise<User[]> {
      return this.userRepository.findAll()
   }
}
