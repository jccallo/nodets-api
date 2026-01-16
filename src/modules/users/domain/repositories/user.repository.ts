import { User } from '../entities/user.model'

export interface UserRepository {
   save(user: User): Promise<User>
   findById(id: string): Promise<User | null>
   findByEmail(email: string): Promise<User | null>
   findAll(): Promise<User[]>
   update(id: string, user: User): Promise<void>
   delete(id: string): Promise<void>
}
