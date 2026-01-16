import { container } from 'tsyringe'
import { eventBus } from '../../../../shared/infrastructure/events/event-bus'
import { User } from '../../../users/domain/entities/user.model'
import { CreatePostUseCase } from '../use-cases/create-post.use-case'

export class PostSubscriber {
   constructor() {
      this.setupSubscriptions()
   }

   private setupSubscriptions(): void {
      // Escuchamos el evento de otro módulo (Users)
      eventBus.listen('user.created', this.onUserCreated.bind(this))
   }

   private async onUserCreated(payload: { user: User }): Promise<void> {
      const { user } = payload

      try {
         const createPostUseCase = container.resolve(CreatePostUseCase)

         await createPostUseCase.execute(user.id.value(), {
            title: `¡Bienvenido ${user.name}!`,
            content: 'Este es tu primer post automático de bienvenida a nuestra plataforma.',
         })

         console.log(`[PostSubscriber] Post de bienvenida creado para el usuario: ${user.id.value()}`)
      } catch (error) {
         console.error(`[PostSubscriber] Error al crear post de bienvenida:`, error)
      }
   }
}
