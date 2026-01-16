import { UserRepository } from '../../../domain/repositories/user.repository'
import { User } from '../../../domain/entities/user.model'
import { UserMapper } from '../../mappers/user.mapper'
import { Knex } from 'knex'
import { injectable, inject } from 'tsyringe'
import { eventBus } from '../../../../../shared/infrastructure/events/event-bus'

@injectable()
export class MySQLUserRepository implements UserRepository {
   constructor(@inject('KnexConnection') private db: Knex) {}

   async save(user: User): Promise<User> {
      const exists = await this.findById(user.id.value())
      const raw = user.getRaw()

      if (exists) {
         await this.db('users').where({ id: user.id.value() }).update({
            email: raw.email,
            name: raw.name,
            password: raw.password,
            updated_at: new Date(),
         })
      } else {
         await this.db('users').insert({
            id: user.id.value(),
            email: raw.email,
            name: raw.name,
            password: raw.password,
            created_at: raw.createdAt || new Date(),
            updated_at: new Date(),
         })

         // Disparar evento de creación (Estilo Laravel)
         eventBus.emit('user.created', { user })
      }

      return user
   }

   async findById(id: string): Promise<User | null> {
      const row = await this.db('users').where({ id }).first()
      return row ? UserMapper.toDomain(row) : null
   }

   async findByEmail(email: string): Promise<User | null> {
      const row = await this.db('users').where({ email }).first()
      return row ? UserMapper.toDomain(row) : null
   }

   async findAll(): Promise<User[]> {
      const rows = await this.db('users').select('*')
      return rows.map((row) => UserMapper.toDomain(row))
   }

   async update(id: string, user: User): Promise<void> {
      const raw = user.getRaw()
      await this.db('users').where({ id }).update({
         email: raw.email,
         name: raw.name,
         password: raw.password,
         updated_at: new Date(),
      })
   }

   async delete(id: string): Promise<void> {
      await this.db('users').where({ id }).del()
   }
}
