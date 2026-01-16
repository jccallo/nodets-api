import { Request, Response } from 'express'
import { HttpStatus } from '@/shared/http-status'
import { createPostUseCase, getPostsByUserUseCase } from '@/shared/services'
import { PostMapper } from '@/modules/posts/infrastructure/mappers/post.mapper'

export class PostController {
   create = async (req: Request, res: Response) => {
      const userId = 'user-id-placeholder' // TODO: Get from Auth Middleware
      const post = await createPostUseCase.execute(userId, req.body)
      res.status(HttpStatus.CREATED).json(PostMapper.toResponse(post))
   }

   getByUser = async (req: Request, res: Response) => {
      const posts = await getPostsByUserUseCase.execute(req.params.userId as string)
      res.status(HttpStatus.OK).json(posts.map((post) => PostMapper.toResponse(post)))
   }
}
