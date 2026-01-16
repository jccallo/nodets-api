import { Aggregate, ID, Result, EntityProps, UID } from 'types-ddd'
import { UserRole } from '../enums/user-role.enum'
import { UserStatus } from '../enums/user-status.enum'

export type UserProps = EntityProps & {
   email: string
   name: string
   password: string
   roles: UserRole[]
   status: UserStatus
   id?: string
   createdAt?: Date
   updatedAt?: Date
}

export class User extends Aggregate<UserProps> {
   private constructor(props: UserProps) {
      super(props)
   }

   public static create(props: UserProps, id?: UID<string>): Result<User> {
      return Result.Ok(new User({ ...props, id: id?.value() }))
   }

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
