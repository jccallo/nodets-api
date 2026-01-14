import { User } from './user.model'

export interface UserRepository {
  save(user: Omit<User, 'id' | 'createdAt'>): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  update(id: string, user: Partial<User>): Promise<void>
  delete(id: string): Promise<void>
}
