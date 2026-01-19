import { Post } from '@/modules/posts/domain/entities/post.model'

export class PostMapper {
   static toDomain(row: any): Post {
      return Post.create({
         id: row.id,
         title: row.title,
         content: row.content,
         userId: row.userId,
         published: !!row.published,
         createdAt: new Date(row.created_at),
         updatedAt: new Date(row.updated_at),
      })
   }

   static toResponse(post: Post): any {
      return {
         id: post.id!,
         title: post.title,
         content: post.content,
         userId: post.userId,
         published: post.published,
         createdAt: (post.createdAt || new Date()).toISOString(),
      }
   }
}
