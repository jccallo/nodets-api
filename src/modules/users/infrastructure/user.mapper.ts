import { User } from '../domain/user.model'
import { ExternalUserDTO } from './user-external.dto'

export class UserMapper {
  static toDomain(external: ExternalUserDTO): User {
    return {
      id: external.id.toString(),
      name: external.name,
      email: external.email,
      createdAt: new Date(), // En este caso JSONPlaceholder no lo da, lo generamos
    }
  }

  static toDomainList(externalList: ExternalUserDTO[]): User[] {
    return externalList.map((external) => this.toDomain(external))
  }
}
