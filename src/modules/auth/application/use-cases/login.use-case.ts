import { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { AppError } from '@/shared/domain/exceptions/app-error'
import { HttpStatus } from '@/shared/http-status'
import { LoginDTO } from '@/modules/auth/application/dto/login.dto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '@/shared/env'
// Removed UserEmail import
import { User } from '@/modules/users/domain/entities/user.model' // Assuming User type is needed for the return signature
export class LoginUseCase {
   constructor(private userRepository: UserRepository) {}

   async execute(data: LoginDTO): Promise<{ user: User; token: string }> {
      const { email, password } = data

      // Buscar usuario por email
      const user = await this.userRepository.findByEmail(email)
      if (!user) {
         throw new AppError('Credenciales inválidas', HttpStatus.UNAUTHORIZED)
      }

      // Validar password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
         throw new AppError('Credenciales inválidas', HttpStatus.UNAUTHORIZED)
      }

      // Generar token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
         expiresIn: '24h',
      })

      // Retornar respuesta sin password
      return {
         user,
         token,
      }
   }
}
