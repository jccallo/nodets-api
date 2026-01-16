import { Request, Response } from 'express'
import { autoInjectable } from 'tsyringe'
import { HttpStatus } from '../../../shared/http-status'
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case'
import { GetPostsByUserUseCase } from '../application/use-cases/get-posts-by-user.use-case'

import { PostMapper } from '../infrastructure/mappers/post.mapper'

@autoInjectable()
export class PostController {
   constructor(private createPostUseCase: CreatePostUseCase, private getPostsByUserUseCase: GetPostsByUserUseCase) {}

   create = async (req: Request, res: Response) => {
      const userId = 'user-id-placeholder' // TODO: Get from Auth Middleware
      const post = await this.createPostUseCase.execute(userId, req.body)
      res.status(HttpStatus.CREATED).json(PostMapper.toResponse(post))
   }

   getByUser = async (req: Request, res: Response) => {
      const posts = await this.getPostsByUserUseCase.execute(req.params.userId as string)
      res.status(HttpStatus.OK).json(posts.map((post) => PostMapper.toResponse(post)))
   }
}
