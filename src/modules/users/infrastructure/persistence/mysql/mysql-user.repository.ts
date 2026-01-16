import { UserRepository, UserFilters } from '@/modules/users/domain/repositories/user.repository'
import { User } from '@/modules/users/domain/entities/user.model'
import { UserMapper } from '@/modules/users/infrastructure/mappers/user.mapper'
import { Knex } from 'knex'
import { eventBus } from '@/shared/infrastructure/events/event-bus'
import { KnexPaginator } from '@/shared/infrastructure/persistence/mysql/knex-paginator'

export class MySQLUserRepository implements UserRepository {
   private readonly tableName = 'users'

   constructor(private readonly db: Knex) {}

   async save(user: User): Promise<User> {
      const exists = user.id ? await this.findById(user.id) : null

      if (exists) {
         await this.db(this.tableName).where({ id: user.id }).update({
            email: user.email,
            name: user.name,
            password: user.password,
            updated_at: new Date(),
         })
      } else {
         const [insertedId] = await this.db(this.tableName).insert({
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password,
            created_at: user.createdAt || new Date(),
            updated_at: new Date(),
         })

         if (!user.id) user.id = insertedId

         // Disparar evento de creación (Estilo Laravel)
         eventBus.emit('user.created', { user })
      }

      return user
   }

   async findById(id: number | string): Promise<User | null> {
      const row = await this.db(this.tableName).where({ id }).first()
      return row ? UserMapper.toDomain(row) : null
   }

   async findByEmail(email: string): Promise<User | null> {
      const row = await this.db(this.tableName).where({ email }).first()
      return row ? UserMapper.toDomain(row) : null
   }

   async findAll(filters: UserFilters = {}): Promise<{ users: User[]; total: number }> {
      const { name, email, page, limit } = filters

      const query = this.db(this.tableName).select('*')

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

   async update(id: number | string, user: User): Promise<void> {
      await this.db(this.tableName).where({ id }).update({
         email: user.email,
         name: user.name,
         password: user.password,
         updated_at: new Date(),
      })
   }

   async delete(id: number | string): Promise<void> {
      await this.db(this.tableName).where({ id }).del()
   }
}
