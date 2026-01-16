import { CreateUserDTO, LoginDTO, UpdateUserDTO } from './dto'
import { UserRepository } from '../domain/repositories/user.repository'
import { User } from '../domain/entities/user.model'
import { AppError } from '../../../shared/errors/app-error'
import { HttpStatus } from '../../../shared/http-status'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../../../shared/env'
import { v4 as uuidv4 } from 'uuid'
import { UserRole } from '../domain/enums/user-role.enum'
import { UserStatus } from '../domain/enums/user-status.enum'

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

      const newUser = new User(
         uuidv4(), // We need uuid here now
         data.email,
         data.name,
         hashedPassword,
         [UserRole.USER],
         UserStatus.ACTIVE,
         new Date()
      )

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

      const updatedUser = new User(
         currentUser.id,
         data.email || currentUser.email,
         data.name || currentUser.name,
         data.password ? await bcrypt.hash(data.password, 10) : currentUser.password,
         currentUser.roles,
         currentUser.status,
         currentUser.createdAt
      )

      await this.userRepository.update(id, updatedUser)
      return updatedUser
   }

   async delete(id: string): Promise<void> {
      await this.getById(id) // Verify exists
      await this.userRepository.delete(id)
   }
}
