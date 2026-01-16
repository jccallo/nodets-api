import { UserRepository } from '../../../domain/repositories/user.repository'
import { CreateUserDTO } from '../../dto'
import { User } from '../../../domain/entities/user.model'
import { AppError } from '../../../../../shared/errors/app-error'
import { HttpStatus } from '../../../../../shared/http-status'

import { UserRole } from '../../../domain/enums/user-role.enum'
import { UserStatus } from '../../../domain/enums/user-status.enum'
import bcrypt from 'bcryptjs'

import { injectable, inject } from 'tsyringe'

@injectable()
export class CreateUserUseCase {
   constructor(@inject('UserRepository') private userRepository: UserRepository) {}

   async execute(data: CreateUserDTO): Promise<User> {
      const existingUser = await this.userRepository.findByEmail(data.email)
      if (existingUser) {
         throw new AppError('El email ya está registrado', HttpStatus.BAD_REQUEST)
      }

      const hashedPassword = await bcrypt.hash(data.password, 10)

      const newUser = new User({
         email: data.email,
         name: data.name,
         password: hashedPassword,
         roles: [UserRole.USER],
         status: UserStatus.ACTIVE,
         createdAt: new Date(),
      })

      return await this.userRepository.save(newUser)
   }
}
