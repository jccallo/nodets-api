import { User, CreateUserDTO, UpdateUserDTO, loginSchema } from '../domain/user.model'
import { UserRepository } from '../domain/user.repository'
import { AppError } from '../../../shared/errors/app-error'
import { HttpStatus } from '../../../shared/http-status'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../../../shared/env'

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

    return await this.userRepository.save({
      ...data,
      password: hashedPassword,
    })
  }

  async login(data: any): Promise<{ user: User; token: string }> {
    const { email, password } = loginSchema.parse(data)

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
    await this.getById(id) // Verify exists

    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email)
      if (existingUser && existingUser.id !== id) {
        throw new AppError('El email ya está en uso por otro usuario', HttpStatus.BAD_REQUEST)
      }
    }

    await this.userRepository.update(id, data)
    return this.getById(id)
  }

  async delete(id: string): Promise<void> {
    await this.getById(id) // Verify exists
    await this.userRepository.delete(id)
  }
}
