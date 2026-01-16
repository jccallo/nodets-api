import { PostRepository } from '../../domain/repositories/post.repository'
import { Post } from '../../domain/entities/post.model'
import { CreatePostDTO } from '../dto/create-post.dto'
import { AppError } from '../../../../shared/errors/app-error'
import { HttpStatus } from '../../../../shared/http-status'

export class CreatePostUseCase {
   constructor(private postRepository: PostRepository) {}

   async execute(userId: string, data: CreatePostDTO): Promise<Post> {
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
