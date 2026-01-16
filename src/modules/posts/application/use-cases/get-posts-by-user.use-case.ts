import { injectable, inject } from 'tsyringe'
import { PostRepository } from '../../domain/repositories/post.repository'
import { Post } from '../../domain/entities/post.model'

@injectable()
export class GetPostsByUserUseCase {
   constructor(@inject('PostRepository') private postRepository: PostRepository) {}

   async execute(userId: string): Promise<Post[]> {
      return this.postRepository.findByUserId(userId)
   }
}
