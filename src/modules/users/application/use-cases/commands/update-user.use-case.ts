import { UserRepository } from '../../../domain/repositories/user.repository'
import { UpdateUserDTO } from '../../dto'
import { User } from '../../../domain/entities/user.model'
import { AppError } from '../../../../../shared/errors/app-error'
import { HttpStatus } from '../../../../../shared/http-status'
// Removed VO imports
import bcrypt from 'bcryptjs'
import { injectable, inject } from 'tsyringe'

@injectable()
export class UpdateUserUseCase {
   constructor(@inject('UserRepository') private userRepository: UserRepository) {}

   async execute(id: string, data: UpdateUserDTO): Promise<User> {
      // Verificar que el usuario existe
      const currentUser = await this.userRepository.findById(id)
      if (!currentUser) {
         throw new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND)
      }

      // Si se está actualizando el email, verificar que no esté en uso
      if (data.email) {
         const existingUser = await this.userRepository.findByEmail(data.email)
         if (existingUser && existingUser.id.value() !== id) {
            throw new AppError('El email ya está en uso por otro usuario', HttpStatus.BAD_REQUEST)
         }
      }

      const raw = currentUser.getRaw()
      const updatedUserResult = User.create(
         {
            email: data.email || raw.email,
            name: data.name || raw.name,
            password: data.password ? await bcrypt.hash(data.password, 10) : raw.password,
            roles: raw.roles,
            status: raw.status,
            createdAt: raw.createdAt,
         },
         currentUser.id
      )

      if (updatedUserResult.isFail()) {
         throw new AppError(updatedUserResult.error(), HttpStatus.INTERNAL_SERVER_ERROR)
      }

      const updatedUser = updatedUserResult.value()

      // Actualizar usuario
      await this.userRepository.update(id, updatedUser)

      return updatedUser
   }
}
