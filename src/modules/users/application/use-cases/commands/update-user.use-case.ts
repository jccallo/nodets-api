import { UserRepository } from '../../../domain/user.repository'
import { UpdateUserDTO } from '../../dto'
import { User } from '../../../domain/user.model'
import { AppError } from '../../../../../shared/errors/app-error'
import { HttpStatus } from '../../../../../shared/http-status'

export class UpdateUserUseCase {
   constructor(private userRepository: UserRepository) {}

   async execute(id: string, data: UpdateUserDTO): Promise<User> {
      // Verificar que el usuario existe
      const user = await this.userRepository.findById(id)
      if (!user) {
         throw new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND)
      }

      // Si se está actualizando el email, verificar que no esté en uso
      if (data.email) {
         const existingUser = await this.userRepository.findByEmail(data.email)
         if (existingUser && existingUser.id !== id) {
            throw new AppError('El email ya está en uso por otro usuario', HttpStatus.BAD_REQUEST)
         }
      }

      // Actualizar usuario
      await this.userRepository.update(id, data)

      // Retornar usuario actualizado
      const updatedUser = await this.userRepository.findById(id)
      if (!updatedUser) {
         throw new AppError('Error al recuperar el usuario actualizado', HttpStatus.INTERNAL_SERVER_ERROR)
      }

      return updatedUser
   }
}
