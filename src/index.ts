import 'reflect-metadata'
import cors from 'cors'
import express from 'express'
import './shared/container' // Register DI container
import { env } from './shared/env'
import { authRoutes } from './modules/auth/ui/auth.routes'
import { postRoutes } from './modules/posts/ui/post.routes'
import { userRoutes } from './modules/users/ui/user.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/posts', postRoutes)

app.listen(env.port, () => {
   console.log(`Server running on port ${env.port}`)
})
