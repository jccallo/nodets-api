import { eventBus } from '@/shared/infrastructure/events/event-bus'
import { User } from '@/modules/users/domain/entities/user.model'
import { emailQueue } from '@/shared/infrastructure/queue/email.queue'

export class UserSubscriber {
   constructor() {
      this.setupSubscriptions()
   }

   private setupSubscriptions(): void {
      eventBus.listen('user.created', this.onUserCreated.bind(this))
   }

   private async onUserCreated(payload: { user: User }): Promise<void> {
      const { user } = payload

      console.log(`[UserSubscriber] Usuario ${user.name} creado. Agregando email de bienvenida a la cola...`)

      // Agregamos la tarea a la cola de BullMQ junto con los datos necesarios
      await emailQueue.add('welcome-email', {
         email: user.email,
         name: user.name,
      })
   }
}
