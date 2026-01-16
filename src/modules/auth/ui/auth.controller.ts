import { Request, Response } from 'express'
import { HttpStatus } from '../../../shared/http-status'
import { LoginUseCase } from '../application/use-cases'

import { autoInjectable } from 'tsyringe'

@autoInjectable()
export class AuthController {
   constructor(private loginUseCase: LoginUseCase) {}

   login = async (req: Request, res: Response) => {
      const result = await this.loginUseCase.execute(req.body)
      res.status(HttpStatus.OK).json(result)
   }
}
