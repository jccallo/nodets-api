import { Request, Response } from 'express'
import { HttpStatus } from '../../../shared/http-status'
import { CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase } from '../application/use-cases/commands'
import { GetAllUsersUseCase, GetUserByIdUseCase } from '../application/use-cases/queries'
import { autoInjectable } from 'tsyringe'
import { UserMapper } from '../infrastructure/mappers/user.mapper'

@autoInjectable()
export class UserController {
   constructor(
      private createUserUseCase: CreateUserUseCase,
      private updateUserUseCase: UpdateUserUseCase,
      private deleteUserUseCase: DeleteUserUseCase,
      private getAllUsersUseCase: GetAllUsersUseCase,
      private getUserByIdUseCase: GetUserByIdUseCase
   ) {}

   getAll = async (_req: Request, res: Response) => {
      const users = await this.getAllUsersUseCase.execute()
      res.status(HttpStatus.OK).json(users.map((u) => UserMapper.toResponse(u)))
   }

   getById = async (req: Request, res: Response) => {
      const user = await this.getUserByIdUseCase.execute(req.params.id as string)
      res.status(HttpStatus.OK).json(UserMapper.toResponse(user))
   }

   create = async (req: Request, res: Response) => {
      const user = await this.createUserUseCase.execute(req.body)
      res.status(HttpStatus.CREATED).json(UserMapper.toResponse(user))
   }

   update = async (req: Request, res: Response) => {
      const user = await this.updateUserUseCase.execute(req.params.id as string, req.body)
      res.status(HttpStatus.OK).json(UserMapper.toResponse(user))
   }

   delete = async (req: Request, res: Response) => {
      await this.deleteUserUseCase.execute(req.params.id as string)
      res.status(HttpStatus.NO_CONTENT).send()
   }
}
