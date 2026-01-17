import { UnitOfWork } from '@/shared/domain/persistence/unit-of-work.interface'
import { eventBus } from '@/shared/infrastructure/events/event-bus'
import { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { CreateUserDTO } from '@/modules/users/application/dto'
import { User } from '@/modules/users/domain/entities/user.model'
import { AppError } from '@/shared/errors/app-error'
import { HttpStatus } from '@/shared/http-status'

import { UserRole } from '@/modules/users/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/users/domain/enums/user-status.enum'
import bcrypt from 'bcryptjs'

export class CreateUserUseCase {
   constructor(
      private unitOfWork: UnitOfWork,
      private userRepository: UserRepository,
   ) {}

   async execute(data: CreateUserDTO): Promise<User> {
      return this.unitOfWork.transaction(async (trx) => {
         const existingUser = await this.userRepository.findByEmail(data.email, trx)
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

         const savedUser = await this.userRepository.save(newUser, trx)

         // Evento movido desde el Repositorio (Mejor práctica: Side Effects en Use Case)
         eventBus.emit('user.created', { user: savedUser })

         return savedUser
      })
   }
}
