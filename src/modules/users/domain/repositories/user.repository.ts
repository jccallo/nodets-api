import { User } from '@/modules/users/domain/entities/user.model'

export interface UserRepository {
   save(user: User): Promise<User>
   findById(id: number | string): Promise<User | null>
   findByEmail(email: string): Promise<User | null>
   findAll(): Promise<User[]>
   update(id: number | string, user: User): Promise<void>
   delete(id: number | string): Promise<void>
}
