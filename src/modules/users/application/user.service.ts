import { CreateUserDTO, UpdateUserDTO } from '@/modules/users/application/dto'
import { LoginDTO } from '@/modules/auth/application/dto'
import { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { User } from '@/modules/users/domain/entities/user.model'
import { AppError } from '@/shared/errors/app-error'
import { HttpStatus } from '@/shared/http-status'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '@/shared/env'
import { v4 as uuidv4 } from 'uuid'
import { UserRole } from '@/modules/users/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/users/domain/enums/user-status.enum'

export class UserService {
   constructor(private userRepository: UserRepository) {}

   async getAll(): Promise<User[]> {
      return this.userRepository.findAll()
   }

   async getById(id: string): Promise<User> {
      const user = await this.userRepository.findById(id)
      if (!user) {
         throw new AppError('Usuario no encontrado', HttpStatus.NOT_FOUND)
      }
      return user
   }

   async create(data: CreateUserDTO): Promise<User> {
      const existingUser = await this.userRepository.findByEmail(data.email)
      if (existingUser) {
         throw new AppError('El email ya está registrado', HttpStatus.BAD_REQUEST)
      }

      const hashedPassword = await bcrypt.hash(data.password, 10)

      const newUser = new User({
         id: uuidv4(),
         email: data.email,
         name: data.name,
         password: hashedPassword,
         roles: [UserRole.USER],
         status: UserStatus.ACTIVE,
         createdAt: new Date(),
      })

      return await this.userRepository.save(newUser)
   }

   async login(data: LoginDTO): Promise<{ user: User; token: string }> {
      const { email, password } = data

      const user = await this.userRepository.findByEmail(email)
      if (!user) {
         throw new AppError('Credenciales inválidas', HttpStatus.UNAUTHORIZED)
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
         throw new AppError('Credenciales inválidas', HttpStatus.UNAUTHORIZED)
      }

      const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
         expiresIn: '24h',
      })

      return { user, token }
   }

   async update(id: string, data: UpdateUserDTO): Promise<User> {
      const currentUser = await this.getById(id) // Verify exists

      if (data.email) {
         const existingUser = await this.userRepository.findByEmail(data.email)
         if (existingUser && existingUser.id !== id) {
            throw new AppError('El email ya está en uso por otro usuario', HttpStatus.BAD_REQUEST)
         }
      }

      const updatedUser = new User({
         id: currentUser.id,
         email: data.email || currentUser.email,
         name: data.name || currentUser.name,
         password: data.password ? await bcrypt.hash(data.password, 10) : currentUser.password,
         roles: currentUser.roles,
         status: currentUser.status,
         createdAt: currentUser.createdAt,
      })

      await this.userRepository.update(id, updatedUser)
      return updatedUser
   }

   async delete(id: string): Promise<void> {
      await this.getById(id) // Verify exists
      await this.userRepository.delete(id)
   }
}
