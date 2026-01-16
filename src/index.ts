import '@/shared/services' // Register Services & Subscribers (Laravel-style)
import { startServer } from '@/app/server'
import { env } from '@/shared/env'

startServer(env.port)
