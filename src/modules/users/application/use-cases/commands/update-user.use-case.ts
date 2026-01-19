import { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { UpdateUserDTO } from '@/modules/users/application/dto'
import { User } from '@/modules/users/domain/entities/user.model'
import { AppError } from '@/shared/domain/exceptions/app-error'
import { HttpStatus } from '@/shared/http-status'
// Removed VO imports
import bcrypt from 'bcryptjs'

export class UpdateUserUseCase {
   constructor(private userRepository: UserRepository) {}

   async execute(id: number | string, data: UpdateUserDTO): Promise<User> {
      // Verificar que el usuario existe
      const currentUser = await this.userRepository.findById(id)
      if (!currentUser) {
         throw new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND)
      }

      // Si se está actualizando el email, verificar que no esté en uso
      if (data.email) {
         const existingUser = await this.userRepository.findByEmail(data.email)
         if (existingUser && existingUser.id !== id) {
            throw new AppError('El email ya está en uso por otro usuario', HttpStatus.BAD_REQUEST)
         }
      }

      const updatedUser = User.create({
         id: currentUser.id!,
         email: data.email || currentUser.email,
         name: data.name || currentUser.name,
         password: data.password ? await bcrypt.hash(data.password, 10) : currentUser.password,
         roles: currentUser.roles,
         status: currentUser.status,
         createdAt: currentUser.createdAt,
         updatedAt: new Date(),
      })

      // Actualizar usuario
      await this.userRepository.update(id, updatedUser)

      return updatedUser
   }
}
