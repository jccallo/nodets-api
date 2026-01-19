import { BaseEntity, BaseProps } from '@/shared/domain/base-entity'
import { UserRole } from '@/modules/users/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/users/domain/enums/user-status.enum'

export interface UserProps extends BaseProps {
   email: string
   name: string
   password: string
   roles: UserRole[]
   status: UserStatus
}

export class User extends BaseEntity<UserProps> {
   get email(): string {
      return this.props.email
   }
   get name(): string {
      return this.props.name
   }
   get password(): string {
      return this.props.password
   }
   get roles(): UserRole[] {
      return this.props.roles
   }
   get status(): UserStatus {
      return this.props.status
   }
}
