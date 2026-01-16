import { userRepository } from '@/modules/users/users.provider'
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case'
import { AuthController } from '@/modules/auth/ui/auth.controller'

export const loginUseCase = new LoginUseCase(userRepository)
export const authController = new AuthController(loginUseCase)
