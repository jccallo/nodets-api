import { User } from '../../domain/entities/user.model'
import { UserStatus } from '../../domain/enums/user-status.enum'
import { ID } from 'types-ddd'
import { UserResponseDTO } from '../../application/dto/user-response.dto'

export class UserMapper {
   static toDomain(row: any): User {
      return User.create(
         {
            email: row.email,
            name: row.name,
            password: row.password,
            roles: [], // Roles placeholder
            status: UserStatus.ACTIVE, // Status placeholder
            createdAt: new Date(row.createdAt),
         },
         ID.create(row.id)
      ).value()
   }

   static toResponse(user: User): UserResponseDTO {
      const props = user.getRaw()
      return {
         id: user.id.value(),
         email: props.email,
         name: props.name,
         roles: props.roles,
         status: props.status,
         createdAt: (props.createdAt || new Date()).toISOString(),
      }
   }
}
