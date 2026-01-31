import { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { User } from '@/modules/users/domain/entities/user.model'
import { AppError } from '@/shared/domain/exceptions/app-error'
import { HttpStatus } from '@/shared/http-status'
import { injectable } from 'tsyringe'

@injectable()
export class GetUserByIdUseCase {
   constructor(private userRepository: UserRepository) {}

   async execute(id: number | string): Promise<User> {
      const user = await this.userRepository.findById(id)
      if (!user) {
         throw new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND)
      }
      return user
   }
}
