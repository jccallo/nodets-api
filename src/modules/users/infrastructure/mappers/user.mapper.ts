import { User } from '../../domain/entities/user.model'
import { UserStatus } from '../../domain/enums/user-status.enum'
import { UserResponseDTO } from '../../application/dto/user-response.dto'

export class UserMapper {
   static toDomain(row: any): User {
      return new User({
         id: row.id,
         email: row.email,
         name: row.name,
         password: row.password,
         roles: [], // Roles placeholder
         status: UserStatus.ACTIVE, // Status placeholder
         createdAt: new Date(row.created_at),
         updatedAt: new Date(row.updated_at),
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
