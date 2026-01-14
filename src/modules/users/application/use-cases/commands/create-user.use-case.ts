import { UserRepository } from '../../../domain/user.repository'
import { CreateUserDTO } from '../../dto'
import { User } from '../../../domain/user.model'
import { AppError } from '../../../../../shared/errors/app-error'
import { HttpStatus } from '../../../../../shared/http-status'
import bcrypt from 'bcryptjs'

export class CreateUserUseCase {
   constructor(private userRepository: UserRepository) {}

   async execute(data: CreateUserDTO): Promise<User> {
      // Validar que el email no exista
      const existingUser = await this.userRepository.findByEmail(data.email)
      if (existingUser) {
         throw new AppError('El email ya está registrado', HttpStatus.BAD_REQUEST)
      }

      // Hash del password
      const hashedPassword = await bcrypt.hash(data.password, 10)

      // Guardar usuario
      return await this.userRepository.save({
         ...data,
         password: hashedPassword,
      })
   }
}
