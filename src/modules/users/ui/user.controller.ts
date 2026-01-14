import { Request, Response } from 'express'
import { HttpStatus } from '../../../shared/http-status'
import {
   CreateUserUseCase,
   UpdateUserUseCase,
   DeleteUserUseCase,
   GetAllUsersUseCase,
   GetUserByIdUseCase,
} from '../application/use-cases'

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
      res.status(HttpStatus.OK).json(users)
   }

   getById = async (req: Request, res: Response) => {
      const user = await this.getUserByIdUseCase.execute(req.params.id as string)
      res.status(HttpStatus.OK).json(user)
   }

   create = async (req: Request, res: Response) => {
      const user = await this.createUserUseCase.execute(req.body)
      res.status(HttpStatus.CREATED).json(user)
   }

   update = async (req: Request, res: Response) => {
      const user = await this.updateUserUseCase.execute(req.params.id as string, req.body)
      res.status(HttpStatus.OK).json(user)
   }

   delete = async (req: Request, res: Response) => {
      await this.deleteUserUseCase.execute(req.params.id as string)
      res.status(HttpStatus.NO_CONTENT).send()
   }
}
