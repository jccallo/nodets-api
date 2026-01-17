import { Worker, Job } from 'bullmq'
import { redisConnection } from '@/shared/infrastructure/queue/redis.connection'
import { logger } from '@/shared/services'

export const welcomeEmailWorker = new Worker(
   'email-queue',
   async (job: Job) => {
      if (job.name === 'welcome-email') {
         const { email, name } = job.data

         logger.info(`✨ Procesando tarea: bienvenido a ${name} (${email})`, { job: job.id })

         // Simulación de envío pesado (3 segundos)
         await new Promise((resolve) => setTimeout(resolve, 3000))

         logger.info(`✅ Correo enviado con éxito a: ${email}`)
      }
   },
   { connection: redisConnection },
)

// Loguear errores del worker
welcomeEmailWorker.on('failed', (job, err) => {
   logger.error(`❌ Error en tarea ${job?.id}: ${err.message}`, err.stack)
})
