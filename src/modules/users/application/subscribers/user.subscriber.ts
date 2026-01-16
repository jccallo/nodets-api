import { eventBus } from '@/shared/infrastructure/events/event-bus'
import { User } from '@/modules/users/domain/entities/user.model'

export class UserSubscriber {
   constructor() {
      this.setupSubscriptions()
   }

   private setupSubscriptions(): void {
      // Escuchamos el evento al estilo Laravel
      eventBus.listen('user.created', this.onUserCreated.bind(this))
   }

   private onUserCreated(payload: { user: User }): void {
      const { user } = payload

      console.log(`[UserSubscriber] ¡Evento recibido! El usuario ${user.name} ha sido creado.`)
      console.log(`[Email] Enviando correo de bienvenida a: ${user.email}`)
   }
}
