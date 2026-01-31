import 'reflect-metadata'
import '@/shared/services' // Register Services & Subscribers (Laravel-style)
import { startServer } from '@/app/server'
import { env } from '@/shared/env'
import { bootstrap } from '@/app/bootstrap'

bootstrap()
startServer(env.port)
