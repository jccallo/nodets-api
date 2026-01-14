import { Request, Response, NextFunction } from 'express'
import { UserService } from '../application/user.service'
import { HttpStatus } from '../../../shared/http-status'

export class UserController {
  constructor(private userService: UserService) {}

  getAll = async (_req: Request, res: Response) => {
    const users = await this.userService.getAll()
    res.status(HttpStatus.OK).json(users)
  }

  create = async (req: Request, res: Response) => {
    const user = await this.userService.create(req.body)
    res.status(HttpStatus.CREATED).json(user)
  }

  getExternalPosts = async (_req: Request, res: Response) => {
    const posts = await this.userService.getExternalPosts()
    res.status(HttpStatus.OK).json(posts)
  }

  getExternalUsers = async (_req: Request, res: Response) => {
    const users = await this.userService.getExternalUsers()
    res.status(HttpStatus.OK).json(users)
  }

  login = async (req: Request, res: Response) => {
    const { token } = req.body
    this.userService.simulateLogin(token)
    res.status(HttpStatus.OK).json({ message: 'Login simulated, token set globally' })
  }
}
