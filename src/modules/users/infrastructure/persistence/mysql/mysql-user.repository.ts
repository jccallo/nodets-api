import { UserRepository, UserFilters } from '@/modules/users/domain/repositories/user.repository'
import { User } from '@/modules/users/domain/entities/user.model'
import { UserMapper } from '@/modules/users/infrastructure/mappers/user.mapper'
import { Knex } from 'knex'
import { eventBus } from '@/shared/infrastructure/events/event-bus'
import { KnexPaginator } from '@/shared/infrastructure/persistence/mysql/knex-paginator'

export class MySQLUserRepository implements UserRepository {
   private readonly tableName = 'users'

   constructor(private readonly db: Knex) {}

   private get dbConn() {
      return this.db
   }

   async save(user: User, trx?: any): Promise<User> {
      const conn = trx || this.db
      const exists = user.id ? await this.findById(user.id, trx) : null

      if (exists) {
         await conn(this.tableName).where({ id: user.id }).update({
            email: user.email,
            name: user.name,
            password: user.password,
         })
      } else {
         const [insertedId] = await conn(this.tableName).insert({
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password,
            createdAt: user.createdAt || new Date(),
         })

         if (!user.id) user.id = insertedId

         // Disparar evento de creación (Estilo Laravel)
         eventBus.emit('user.created', { user })
      }

      return user
   }

   async findById(id: number | string, trx?: any): Promise<User | null> {
      const conn = trx || this.db
      const row = await conn(this.tableName).where({ id }).first()
      return row ? UserMapper.toDomain(row) : null
   }

   async findByEmail(email: string, trx?: any): Promise<User | null> {
      const conn = trx || this.db
      const row = await conn(this.tableName).where({ email }).first()
      return row ? UserMapper.toDomain(row) : null
   }

   async findAll(filters: UserFilters = {}, trx?: any): Promise<{ users: User[]; total: number }> {
      const { name, email, page, limit } = filters
      const conn = trx || this.db

      const query = conn(this.tableName).select('*')

      if (name) query.where('name', 'like', `%${name}%`)
      if (email) query.where('email', 'like', `%${email}%`)

      const { data, meta } = await KnexPaginator.paginate<any>({
         query,
         page,
         limit,
      })

      return {
         users: data.map((row: any) => UserMapper.toDomain(row)),
         total: meta.total,
      }
   }

   async update(id: number | string, user: User, trx?: any): Promise<void> {
      const conn = trx || this.db
      await conn(this.tableName).where({ id }).update({
         email: user.email,
         name: user.name,
         password: user.password,
      })
   }

   async delete(id: number | string, trx?: any): Promise<void> {
      const conn = trx || this.db
      await conn(this.tableName).where({ id }).del()
   }
}
