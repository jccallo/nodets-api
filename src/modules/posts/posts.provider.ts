import { db } from '@/shared/infrastructure/persistence/drivers/mysql/connection'
import { MySQLPostRepository } from '@/modules/posts/infrastructure/persistence/mysql/mysql-post.repository'
import { CreatePostUseCase } from '@/modules/posts/application/use-cases/create-post.use-case'
import { GetPostsByUserUseCase } from '@/modules/posts/application/use-cases/get-posts-by-user.use-case'
import { PostSubscriber } from '@/modules/posts/application/subscribers/post.subscriber'

export const postRepository = new MySQLPostRepository(db)

export const createPostUseCase = new CreatePostUseCase(postRepository)
export const getPostsByUserUseCase = new GetPostsByUserUseCase(postRepository)

import { PostController } from '@/modules/posts/ui/post.controller'
export const postController = new PostController()

// Inicializar subscriber
new PostSubscriber(createPostUseCase)
