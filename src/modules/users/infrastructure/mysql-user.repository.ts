import { UserRepository } from '../domain/user.repository'
import { User } from '../domain/user.model'
import { pool } from '../../../shared/infrastructure/persistence/mysql-connection'
import { ResultSetHeader, RowDataPacket } from 'mysql2'

export class MySQLUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    const query = 'INSERT INTO users (id, email, name, createdAt) VALUES (?, ?, ?, ?)'
    await pool.execute(query, [user.id, user.email, user.name, user.createdAt])
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?'
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id])

    if (rows.length === 0) return null

    const row = rows[0]
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: new Date(row.createdAt),
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ?'
    const [rows] = await pool.execute<RowDataPacket[]>(query, [email])

    if (rows.length === 0) return null

    const row = rows[0]
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: new Date(row.createdAt),
    }
  }

  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM users'
    const [rows] = await pool.execute<RowDataPacket[]>(query)

    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: new Date(row.createdAt),
    }))
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM users WHERE id = ?'
    await pool.execute(query, [id])
  }
}
