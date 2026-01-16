import { User } from '@/modules/users/domain/entities/user.model'

export interface UserFilters {
   name?: string
   email?: string
   page?: number
   limit?: number
}

export interface UserRepository {
   save(user: User, trx?: any): Promise<User>
   findById(id: number | string, trx?: any): Promise<User | null>
   findByEmail(email: string, trx?: any): Promise<User | null>
   findAll(filters?: UserFilters, trx?: any): Promise<{ users: User[]; total: number }>
   update(id: number | string, user: User, trx?: any): Promise<void>
   delete(id: number | string, trx?: any): Promise<void>
}
