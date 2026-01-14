import { UserRepository } from '../../../domain/user.repository'
import { LoginDTO } from '../../dto'
import { User } from '../../../domain/user.model'
import { AppError } from '../../../../../shared/errors/app-error'
import { HttpStatus } from '../../../../../shared/http-status'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../../../../../shared/env'

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

      return { user, token }
   }
}
