import { env } from './shared/env'
import { startServer } from './app/server'

startServer(env.port)
