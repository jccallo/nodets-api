import { Post } from '@/modules/posts/domain/entities/post.model'

export interface PostRepository {
   save(post: Post, trx?: any): Promise<Post>
   findById(id: number | string, trx?: any): Promise<Post | null>
   findByUserId(userId: number | string, trx?: any): Promise<Post[]>
   delete(id: number | string, trx?: any): Promise<void>
}
