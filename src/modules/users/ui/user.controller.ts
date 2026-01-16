import { Request, Response } from 'express'
import { HttpStatus } from '@/shared/http-status'
import {
   createUserUseCase,
   updateUserUseCase,
   deleteUserUseCase,
   getAllUsersUseCase,
   getUserByIdUseCase,
} from '@/shared/services'
import { UserMapper } from '@/modules/users/infrastructure/mappers/user.mapper'

export class UserController {
   getAll = async (req: Request, res: Response) => {
      const { name, email, page, limit } = req.query
      const { users, total } = await getAllUsersUseCase.execute({
         name: name as string,
         email: email as string,
         page: page ? Number(page) : undefined,
         limit: limit ? Number(limit) : undefined,
      })

      res.status(HttpStatus.OK).json({
         data: users.map((u) => UserMapper.toResponse(u)),
         meta: { total, page: page || 1, limit: limit || 10 },
      })
   }

   getById = async (req: Request, res: Response) => {
      const user = await getUserByIdUseCase.execute(req.params.id as string)
      res.status(HttpStatus.OK).json(UserMapper.toResponse(user))
   }

   create = async (req: Request, res: Response) => {
      const user = await createUserUseCase.execute(req.body)
      res.status(HttpStatus.CREATED).json(UserMapper.toResponse(user))
   }

   update = async (req: Request, res: Response) => {
      const user = await updateUserUseCase.execute(req.params.id as string, req.body)
      res.status(HttpStatus.OK).json(UserMapper.toResponse(user))
   }

   delete = async (req: Request, res: Response) => {
      await deleteUserUseCase.execute(req.params.id as string)
      res.status(HttpStatus.NO_CONTENT).send()
   }
}
