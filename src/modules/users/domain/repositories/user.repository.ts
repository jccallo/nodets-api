import { User } from '@/modules/users/domain/entities/user.model'

export interface UserFilters {
   name?: string
   email?: string
   page?: number
   limit?: number
}

export interface UserRepository {
   save(user: User): Promise<User>
   findById(id: number | string): Promise<User | null>
   findByEmail(email: string): Promise<User | null>
   findAll(filters?: UserFilters): Promise<{ users: User[]; total: number }>
   update(id: number | string, user: User): Promise<void>
   delete(id: number | string): Promise<void>
}
