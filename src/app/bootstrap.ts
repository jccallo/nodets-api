import { UserSubscriber } from '@/modules/users/application/subscribers/user.subscriber'
import '@/modules/users/application/workers/welcome-email.worker'

export function bootstrap() {
   // Initialize subscribers
   new UserSubscriber()
}
