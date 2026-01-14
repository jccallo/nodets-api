import { UserRepository } from '../../../domain/user.repository'
import { User } from '../../../domain/user.model'
import { AppError } from '../../../../../shared/errors/app-error'
import { HttpStatus } from '../../../../../shared/http-status'

export class GetUserByIdUseCase {
   constructor(private userRepository: UserRepository) {}

   async execute(id: string): Promise<User> {
      const user = await this.userRepository.findById(id)
      if (!user) {
         throw new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND)
      }
      return user
   }
}
