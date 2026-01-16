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
   getAll = async (_req: Request, res: Response) => {
      const users = await getAllUsersUseCase.execute()
      res.status(HttpStatus.OK).json(users.map((u) => UserMapper.toResponse(u)))
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
