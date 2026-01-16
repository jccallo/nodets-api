import { PostRepository } from '@/modules/posts/domain/repositories/post.repository'
import { Post } from '@/modules/posts/domain/entities/post.model'

export class GetPostsByUserUseCase {
   constructor(private postRepository: PostRepository) {}

   async execute(userId: string): Promise<Post[]> {
      return this.postRepository.findByUserId(userId)
   }
}
