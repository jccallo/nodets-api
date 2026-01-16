import { PostRepository } from '@/modules/posts/domain/repositories/post.repository'
import { Post } from '@/modules/posts/domain/entities/post.model'
import { PostMapper } from '@/modules/posts/infrastructure/mappers/post.mapper'
import { Knex } from 'knex'

export class MySQLPostRepository implements PostRepository {
   private readonly tableName = 'posts'

   constructor(private readonly db: Knex) {}

   async save(post: Post, trx?: any): Promise<Post> {
      const conn = trx || this.db
      const exists = post.id ? await this.findById(post.id, trx) : null

      if (exists) {
         await conn(this.tableName).where({ id: post.id }).update({
            title: post.title,
            content: post.content,
            published: post.published,
            updated_at: new Date(),
         })
      } else {
         await conn(this.tableName).insert({
            id: post.id,
            title: post.title,
            content: post.content,
            userId: post.userId,
            published: post.published,
            created_at: post.createdAt || new Date(),
            updated_at: new Date(),
         })
      }
      return post
   }

   async findById(id: number | string, trx?: any): Promise<Post | null> {
      const conn = trx || this.db
      const row = await conn(this.tableName).where({ id }).first()
      return row ? PostMapper.toDomain(row) : null
   }

   async findByUserId(userId: number | string, trx?: any): Promise<Post[]> {
      const conn = trx || this.db
      const rows = await conn(this.tableName).where({ userId })
      return rows.map((row: any) => PostMapper.toDomain(row))
   }

   async delete(id: number | string, trx?: any): Promise<void> {
      const conn = trx || this.db
      await conn(this.tableName).where({ id }).del()
   }
}
