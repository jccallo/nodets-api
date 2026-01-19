import { User } from '@/modules/users/domain/entities/user.model'
import { UserStatus } from '@/modules/users/domain/enums/user-status.enum'
import { UserResponseDTO } from '@/modules/users/application/dto/user-response.dto'

export class UserMapper {
   static toDomain(row: any): User {
      return User.create({
         id: row.id,
         email: row.email,
         name: row.name,
         password: row.password,
         roles: [], // Roles placeholder
         status: UserStatus.ACTIVE, // Status placeholder
         createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      })
   }

   static toResponse(user: User): UserResponseDTO {
      return {
         id: user.id!,
         email: user.email,
         name: user.name,
         roles: user.roles,
         status: user.status,
         createdAt: (user.createdAt || new Date()).toISOString(),
      }
   }
}
