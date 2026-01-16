import { PostRepository } from '@/modules/posts/domain/repositories/post.repository'
import { Post } from '@/modules/posts/domain/entities/post.model'
import { PostMapper } from '@/modules/posts/infrastructure/mappers/post.mapper'
import { Knex } from 'knex'

export class MySQLPostRepository implements PostRepository {
   private readonly tableName = 'posts'

   constructor(private readonly db: Knex) {}

   async save(post: Post): Promise<Post> {
      const exists = post.id ? await this.findById(post.id) : null

      if (exists) {
         await this.db(this.tableName).where({ id: post.id }).update({
            title: post.title,
            content: post.content,
            published: post.published,
            updated_at: new Date(),
         })
      } else {
         await this.db(this.tableName).insert({
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

   async findById(id: number | string): Promise<Post | null> {
      const row = await this.db(this.tableName).where({ id }).first()
      return row ? PostMapper.toDomain(row) : null
   }

   async findByUserId(userId: number | string): Promise<Post[]> {
      const rows = await this.db(this.tableName).where({ userId })
      return rows.map((row: any) => PostMapper.toDomain(row))
   }

   async delete(id: number | string): Promise<void> {
      await this.db(this.tableName).where({ id }).del()
   }
}
