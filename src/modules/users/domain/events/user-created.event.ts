import { UID } from 'types-ddd'
import { User } from '../entities/user.model'

export class UserCreatedEvent {
   constructor(public readonly user: User) {}

   getAggregateId(): UID<string> {
      return this.user.id
   }
}
