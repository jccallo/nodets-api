import { Request, Response } from 'express'
import { HttpStatus } from '@/shared/http-status'
import { injectable } from 'tsyringe'
import { CreateUserUseCase } from '@/modules/users/application/use-cases/commands/create-user.use-case'
import { UpdateUserUseCase } from '@/modules/users/application/use-cases/commands/update-user.use-case'
import { DeleteUserUseCase } from '@/modules/users/application/use-cases/commands/delete-user.use-case'
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/queries/get-user-by-id.use-case'
import { GetAllUsersUseCase } from '@/modules/users/application/use-cases/queries/get-all-users.use-case'
import { UserMapper } from '@/modules/users/infrastructure/mappers/user.mapper'

@injectable()
export class UserController {
   constructor(
      private createUserUseCase: CreateUserUseCase,
      private updateUserUseCase: UpdateUserUseCase,
      private deleteUserUseCase: DeleteUserUseCase,
      private getAllUsersUseCase: GetAllUsersUseCase,
      private getUserByIdUseCase: GetUserByIdUseCase,
   ) {}
   getAll = async (req: Request, res: Response) => {
      const { name, email, page, limit } = req.query
      const { users, total } = await this.getAllUsersUseCase.execute({
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
