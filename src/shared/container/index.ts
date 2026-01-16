import { container } from 'tsyringe'
import { UserRepository } from '../../modules/users/domain/repositories/user.repository'
import { MySQLUserRepository } from '../../modules/users/infrastructure/persistence/mysql/mysql-user.repository'
import { PostRepository } from '../../modules/posts/domain/repositories/post.repository'
import { MySQLPostRepository } from '../../modules/posts/infrastructure/persistence/mysql/mysql-post.repository'

// Registers the dependency injection
// We bind the interface token (as a string or symbol) to the implementation class
container.register<UserRepository>('UserRepository', {
   useClass: MySQLUserRepository,
})

container.register<PostRepository>('PostRepository', {
   useClass: MySQLPostRepository,
})

import { UserSubscriber } from '../../modules/users/application/subscribers/user.subscriber'
import { PostSubscriber } from '../../modules/posts/application/subscribers/post.subscriber'

// Initialize Subscribers
new UserSubscriber()
new PostSubscriber()

export { container }
