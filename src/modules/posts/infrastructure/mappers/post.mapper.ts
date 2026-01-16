import { Post } from '../../domain/entities/post.model'
import { ID } from 'types-ddd'

export class PostMapper {
   static toDomain(row: any): Post {
      const postOrError = Post.create(
         {
            title: row.title,
            content: row.content,
            userId: row.userId,
            published: !!row.published,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updated_at),
         },
         ID.create(row.id)
      )

      if (postOrError.isFail()) {
         throw new Error(postOrError.error())
      }

      return postOrError.value()
   }

   static toResponse(post: Post): any {
      const props = post.getRaw()
      return {
         id: post.id.value(),
         title: props.title,
         content: props.content,
         userId: props.userId,
         published: props.published,
         createdAt: (props.createdAt || new Date()).toISOString(),
      }
   }
}
