import { db } from '../../../shared/infrastructure/persistence/mysql/connection'
import { MySQLPostRepository } from './persistence/mysql/mysql-post.repository'
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case'
import { GetPostsByUserUseCase } from '../application/use-cases/get-posts-by-user.use-case'
import { PostSubscriber } from '../application/subscribers/post.subscriber'

export const postRepository = new MySQLPostRepository(db)

export const createPostUseCase = new CreatePostUseCase(postRepository)
export const getPostsByUserUseCase = new GetPostsByUserUseCase(postRepository)

// Inicializar subscriber
new PostSubscriber(createPostUseCase)
