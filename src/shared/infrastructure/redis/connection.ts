import { env } from '@/shared/env'

export const redisConnection = {
   host: env.redis.host,
   port: env.redis.port,
}
