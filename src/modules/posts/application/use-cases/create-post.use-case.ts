import { injectable, inject } from 'tsyringe'
import { PostRepository } from '../../domain/repositories/post.repository'
import { Post } from '../../domain/entities/post.model'
import { CreatePostDTO } from '../dto/create-post.dto'
import { AppError } from '../../../../shared/errors/app-error'
import { HttpStatus } from '../../../../shared/http-status'

@injectable()
export class CreatePostUseCase {
   constructor(@inject('PostRepository') private postRepository: PostRepository) {}

   async execute(userId: string, data: CreatePostDTO): Promise<Post> {
      const postOrError = Post.create({
         title: data.title,
         content: data.content,
         userId,
         published: false, // Default published to false
         createdAt: new Date(),
      })

      if (postOrError.isFail()) {
         throw new AppError(postOrError.error(), HttpStatus.INTERNAL_SERVER_ERROR)
      }

      return this.postRepository.save(postOrError.value())
   }
}
