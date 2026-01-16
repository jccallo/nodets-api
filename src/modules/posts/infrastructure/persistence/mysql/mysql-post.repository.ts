import { injectable, inject } from 'tsyringe'
import { PostRepository } from '../../../domain/repositories/post.repository'
import { Post } from '../../../domain/entities/post.model'
import { PostMapper } from '../../mappers/post.mapper'
import { Knex } from 'knex'

@injectable()
export class MySQLPostRepository implements PostRepository {
   constructor(@inject('KnexConnection') private db: Knex) {}

   async save(post: Post): Promise<Post> {
      const exists = await this.findById(post.id.value())
      const raw = post.getRaw()

      if (exists) {
         await this.db('posts').where({ id: post.id.value() }).update({
            title: raw.title,
            content: raw.content,
            published: raw.published,
            updated_at: new Date(),
         })
      } else {
         await this.db('posts').insert({
            id: post.id.value(),
            title: raw.title,
            content: raw.content,
            userId: raw.userId,
            published: raw.published,
            created_at: raw.createdAt || new Date(),
            updated_at: new Date(),
         })
      }
      return post
   }

   async findById(id: string): Promise<Post | null> {
      const row = await this.db('posts').where({ id }).first()
      return row ? PostMapper.toDomain(row) : null
   }

   async findByUserId(userId: string): Promise<Post[]> {
      const rows = await this.db('posts').where({ userId })
      return rows.map((row: any) => PostMapper.toDomain(row))
   }

   async delete(id: string): Promise<void> {
      await this.db('posts').where({ id }).del()
   }
}
