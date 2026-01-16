import { UserRepository } from '../../../domain/repositories/user.repository'
import { User } from '../../../domain/entities/user.model'
import { UserMapper } from '../../mappers/user.mapper'
import { Knex } from 'knex'
import { eventBus } from '../../../../../shared/infrastructure/events/event-bus'

export class MySQLUserRepository implements UserRepository {
   constructor(private db: Knex) {}

   async save(user: User): Promise<User> {
      const exists = user.id ? await this.findById(user.id) : null

      if (exists) {
         await this.db('users').where({ id: user.id }).update({
            email: user.email,
            name: user.name,
            password: user.password,
            updated_at: new Date(),
         })
      } else {
         await this.db('users').insert({
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password,
            created_at: user.createdAt || new Date(),
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
      await this.db('users').where({ id }).update({
         email: user.email,
         name: user.name,
         password: user.password,
         updated_at: new Date(),
      })
   }

   async delete(id: string): Promise<void> {
      await this.db('users').where({ id }).del()
   }
}
