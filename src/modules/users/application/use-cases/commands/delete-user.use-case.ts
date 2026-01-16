import { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { AppError } from '@/shared/errors/app-error'
import { HttpStatus } from '@/shared/http-status'

export class DeleteUserUseCase {
   constructor(private userRepository: UserRepository) {}

   async execute(id: number | string): Promise<void> {
      const user = await this.userRepository.findById(id)
      if (!user) {
         throw new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND)
      }

      // Eliminar usuario
      await this.userRepository.delete(id)
   }
}
