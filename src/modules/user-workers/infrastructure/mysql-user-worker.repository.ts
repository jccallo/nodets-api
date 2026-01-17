import { IUserWorkerRepository, UserWorkerFilters } from '@/modules/user-workers/domain/user-worker.repository'
import { IUserWorker } from '@/modules/user-workers/domain/user-worker.model'
import { Knex } from 'knex'
import { DB } from '@/shared/infrastructure/persistence/db'

export class MySQLUserWorkerRepository implements IUserWorkerRepository {
   private readonly tableName = 'user_workers'

   constructor(private readonly db: Knex) {}

   async create(userWorker: IUserWorker): Promise<IUserWorker> {
      const [id] = await this.db(this.tableName).insert(userWorker)
      return { ...userWorker, id }
   }

   async update(id: number, userWorker: Partial<IUserWorker>): Promise<IUserWorker | null> {
      await this.db(this.tableName).where({ id }).update(userWorker)
      return this.getById(id)
   }

   async delete(id: number): Promise<boolean> {
      const deleted = await this.db(this.tableName).where({ id }).del()
      return deleted > 0
   }

   async getAll(filters: UserWorkerFilters = {}): Promise<{ data: IUserWorker[]; total: number }> {
      const { name, page, limit } = filters
      const query = this.db(this.tableName).select('*')

      if (name) query.where('name', 'like', `%${name}%`)

      const { data, meta } = await DB.paginate<IUserWorker>({
         query,
         page,
         limit,
      })

      return {
         data,
         total: meta.total,
      }
   }

   async getById(id: number): Promise<IUserWorker | null> {
      const row = await this.db(this.tableName).where({ id }).first()
      return row || null
   }
}
