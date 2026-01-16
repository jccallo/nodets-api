import { Post } from '@/modules/posts/domain/entities/post.model'

export interface PostRepository {
   save(post: Post): Promise<Post>
   findById(id: string): Promise<Post | null>
   findByUserId(userId: string): Promise<Post[]>
   delete(id: string): Promise<void>
}
