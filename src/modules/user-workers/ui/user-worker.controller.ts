import { Response, Request } from 'express'
import { HttpStatus } from '../../../shared/http-status'
import {
   CreateUserWorkerUseCase,
   UpdateUserWorkerUseCase,
   DeleteUserWorkerUseCase,
   GetAllUserWorkersUseCase,
   GetUserWorkerByIdUseCase,
} from '../application/use-cases'

export class UserWorkerController {
   constructor(
      private createUserWorkerUseCase: CreateUserWorkerUseCase,
      private updateUserWorkerUseCase: UpdateUserWorkerUseCase,
      private deleteUserWorkerUseCase: DeleteUserWorkerUseCase,
      private getAllUserWorkersUseCase: GetAllUserWorkersUseCase,
      private getUserWorkerByIdUseCase: GetUserWorkerByIdUseCase
   ) {}

   create = async (req: Request, res: Response) => {
      const result = await this.createUserWorkerUseCase.execute(req.body)
      res.status(HttpStatus.CREATED).json(result)
   }

   update = async (req: Request, res: Response) => {
      const result = await this.updateUserWorkerUseCase.execute(Number(req.params.id), req.body)
      res.status(HttpStatus.OK).json(result)
   }

   delete = async (req: Request, res: Response) => {
      await this.deleteUserWorkerUseCase.execute(Number(req.params.id))
      res.status(HttpStatus.NO_CONTENT).send()
   }

   getAll = async (_req: Request, res: Response) => {
      const result = await this.getAllUserWorkersUseCase.execute()
      res.status(HttpStatus.OK).json(result)
   }

   getById = async (req: Request, res: Response) => {
      const result = await this.getUserWorkerByIdUseCase.execute(Number(req.params.id))
      res.status(HttpStatus.OK).json(result)
   }
}