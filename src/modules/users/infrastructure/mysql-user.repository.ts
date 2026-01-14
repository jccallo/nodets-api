import { UserRepository } from '../domain/user.repository'
import { User } from '../domain/user.model'
import { db } from '../../../shared/infrastructure/persistence/mysql/connection'

export class MySQLUserRepository implements UserRepository {
   async save(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
      await db('users').insert({
         email: user.email,
         name: user.name,
         password: user.password,
      })

      const createdUser = await this.findByEmail(user.email)
      if (!createdUser) throw new Error('Error al recuperar el usuario creado')
      return createdUser
   }

   async findById(id: string): Promise<User | null> {
      const row = await db('users').where({ id }).first()
      if (!row) return null

      return {
         id: row.id,
         email: row.email,
         name: row.name,
         password: row.password,
         createdAt: new Date(row.createdAt),
      }
   }

   async findByEmail(email: string): Promise<User | null> {
      const row = await db('users').where({ email }).first()
      if (!row) return null

      return {
         id: row.id,
         email: row.email,
         name: row.name,
         password: row.password,
         createdAt: new Date(row.createdAt),
      }
   }

   async findAll(): Promise<User[]> {
      const rows = await db('users').select('*')
      return rows.map((row) => ({
         id: row.id,
         email: row.email,
         name: row.name,
         password: row.password,
         createdAt: new Date(row.createdAt),
      }))
   }

   async update(id: string, user: Partial<User>): Promise<void> {
      await db('users').where({ id }).update(user)
   }

   async delete(id: string): Promise<void> {
      await db('users').where({ id }).del()
   }
}
