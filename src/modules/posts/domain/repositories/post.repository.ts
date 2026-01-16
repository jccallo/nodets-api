import { Post } from '@/modules/posts/domain/entities/post.model'

export interface PostRepository {
   save(post: Post): Promise<Post>
   findById(id: number | string): Promise<Post | null>
   findByUserId(userId: number | string): Promise<Post[]>
   delete(id: number | string): Promise<void>
}
