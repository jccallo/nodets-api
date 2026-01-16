import { PostRepository } from '../../domain/repositories/post.repository'
import { Post } from '../../domain/entities/post.model'

export class GetPostsByUserUseCase {
   constructor(private postRepository: PostRepository) {}

   async execute(userId: string): Promise<Post[]> {
      return this.postRepository.findByUserId(userId)
   }
}
