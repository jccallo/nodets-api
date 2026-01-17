import { UserRepository as IUserRepository, UserFilters } from '@/modules/users/domain/repositories/user.repository'
import { User } from '@/modules/users/domain/entities/user.model'
import { UserMapper } from '@/modules/users/infrastructure/mappers/user.mapper'

import { DB } from '@/shared/infrastructure/persistence/db'

export class UserRepository implements IUserRepository {
   private readonly tableName = 'users'

   async save(user: User): Promise<User> {
      const exists = user.id ? await this.findById(user.id) : null

      if (exists) {
         await DB.table(this.tableName).where({ id: user.id }).update({
            email: user.email,
            name: user.name,
            password: user.password,
         })
      } else {
         const [insertedId] = await DB.table(this.tableName).insert({
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password,
            createdAt: user.createdAt || new Date(),
         })

         if (!user.id) user.id = insertedId
      }

      return user
   }

   async findById(id: number | string): Promise<User | null> {
      const row = await DB.table(this.tableName).where({ id }).first()
      return row ? UserMapper.toDomain(row) : null
   }

   async findByEmail(email: string): Promise<User | null> {
      const row = await DB.table(this.tableName).where({ email }).first()
      return row ? UserMapper.toDomain(row) : null
   }

   async findAll(filters: UserFilters = {}): Promise<{ users: User[]; total: number }> {
      const { name, email, page, limit } = filters

      const query = DB.table(this.tableName).select('*')

      if (name) query.where('name', 'like', `%${name}%`)
      if (email) query.where('email', 'like', `%${email}%`)

      const { data, meta } = await DB.paginate<any>({
         query,
         page,
         limit,
      })

      return {
         users: data.map((row: any) => UserMapper.toDomain(row)),
         total: meta.total,
      }
   }

   async update(id: number | string, user: User): Promise<void> {
      await DB.table(this.tableName).where({ id }).update({
         email: user.email,
         name: user.name,
         password: user.password,
      })
   }

   async delete(id: number | string): Promise<void> {
      await DB.table(this.tableName).where({ id }).del()
   }
}
