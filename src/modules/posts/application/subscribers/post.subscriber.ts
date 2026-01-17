import { eventBus } from '@/shared/infrastructure/events/event-bus'
import { User } from '@/modules/users/domain/entities/user.model'
import { CreatePostUseCase } from '@/modules/posts/application/use-cases/create-post.use-case'

export class PostSubscriber {
   constructor(private createPostUseCase: CreatePostUseCase) {
      this.setupSubscriptions()
   }

   private setupSubscriptions(): void {
      // Escuchamos el evento de otro módulo (Users)
      // eventBus.listen('user.created', this.onUserCreated.bind(this))
   }

   private async onUserCreated(payload: { user: User }): Promise<void> {
      const { user } = payload

      if (!user.id) return

      try {
         await this.createPostUseCase.execute(user.id, {
            title: `¡Bienvenido ${user.name}!`,
            content: 'Este es tu primer post automático de bienvenida a nuestra plataforma.',
         })

         console.log(`[PostSubscriber] Post de bienvenida creado para el usuario: ${user.id}`)
      } catch (error) {
         console.error(`[PostSubscriber] Error al crear post de bienvenida:`, error)
      }
   }
}
