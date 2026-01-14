import { Request, Response } from 'express'
import { UserService } from '../application/user.service'
import { HttpStatus } from '../../../shared/http-status'

export class UserController {
  constructor(private userService: UserService) {}

  getAll = async (_req: Request, res: Response) => {
    const users = await this.userService.getAll()
    res.status(HttpStatus.OK).json(users)
  }

  getById = async (req: Request, res: Response) => {
    const user = await this.userService.getById(req.params.id as string)
    res.status(HttpStatus.OK).json(user)
  }

  create = async (req: Request, res: Response) => {
    const user = await this.userService.create(req.body)
    res.status(HttpStatus.CREATED).json(user)
  }

  update = async (req: Request, res: Response) => {
    const user = await this.userService.update(req.params.id as string, req.body)
    res.status(HttpStatus.OK).json(user)
  }

  delete = async (req: Request, res: Response) => {
    await this.userService.delete(req.params.id as string)
    res.status(HttpStatus.NO_CONTENT).send()
  }

  login = async (req: Request, res: Response) => {
    const result = await this.userService.login(req.body)
    res.status(HttpStatus.OK).json(result)
  }
}
