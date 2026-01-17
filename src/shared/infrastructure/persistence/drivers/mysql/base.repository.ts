import { Knex } from 'knex'

export abstract class BaseRepository<T> {
   constructor(protected readonly db: Knex, protected readonly tableName: string) {}

   async findById(id: number | string): Promise<T | null> {
      const row = await this.db(this.tableName).where({ id }).first()
      return row || null
   }

   async findAll(filters: any = {}): Promise<any> {
      return this.db(this.tableName).select('*')
   }

   async delete(id: number | string): Promise<void> {
      await this.db(this.tableName).where({ id }).del()
   }

   async exists(id: number | string): Promise<boolean> {
      const row = await this.db(this.tableName).select('id').where({ id }).first()
      return !!row
   }
}
