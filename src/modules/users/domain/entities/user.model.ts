import { UserRole } from '../enums/user-role.enum'
import { UserStatus } from '../enums/user-status.enum'

export class User {
   public id?: string
   public email: string
   public name: string
   public password: string
   public roles: UserRole[]
   public status: UserStatus
   public createdAt?: Date
   public updatedAt?: Date

   constructor(props: {
      email: string
      name: string
      password: string
      roles: UserRole[]
      status: UserStatus
      id?: string
      createdAt?: Date
      updatedAt?: Date
   }) {
      this.id = props.id
      this.email = props.email
      this.name = props.name
      this.password = props.password
      this.roles = props.roles
      this.status = props.status
      this.createdAt = props.createdAt
      this.updatedAt = props.updatedAt
   }
}
