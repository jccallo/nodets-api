import { UserRepository, UserFilters } from '@/modules/users/domain/repositories/user.repository'
import { User } from '@/modules/users/domain/entities/user.model'

export class GetAllUsersUseCase {
   constructor(private userRepository: UserRepository) {}

   async execute(filters?: UserFilters): Promise<{ users: User[]; total: number }> {
      return this.userRepository.findAll(filters)
   }
}
