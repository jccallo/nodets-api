import { PostRepository } from '@/modules/posts/domain/repositories/post.repository'
import { Post } from '@/modules/posts/domain/entities/post.model'
import { CreatePostDTO } from '@/modules/posts/application/dto/create-post.dto'
import { AppError } from '@/shared/errors/app-error'
import { HttpStatus } from '@/shared/http-status'

export class CreatePostUseCase {
   constructor(private postRepository: PostRepository) {}

   async execute(userId: number | string, data: CreatePostDTO): Promise<Post> {
      const post = new Post({
         title: data.title,
         content: data.content,
         userId,
         published: false, // Default published to false
         createdAt: new Date(),
      })

      return this.postRepository.save(post)
   }
}
