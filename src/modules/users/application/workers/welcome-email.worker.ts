import { Worker, Job } from 'bullmq'
import { redisConnection } from '@/shared/infrastructure/queue/redis.connection'

export const welcomeEmailWorker = new Worker(
   'email-queue',
   async (job: Job) => {
      if (job.name === 'welcome-email') {
         const { email, name } = job.data

         console.log(`[Worker] ✨ Procesando tarea: bienvenido a ${name} (${email})`)

         // Simulación de envío pesado (3 segundos)
         await new Promise((resolve) => setTimeout(resolve, 3000))

         console.log(`[Worker] ✅ Correo enviado con éxito a: ${email}`)
      }
   },
   { connection: redisConnection }
)

// Loguear errores del worker
welcomeEmailWorker.on('failed', (job, err) => {
   console.error(`[Worker] ❌ Error en tarea ${job?.id}: ${err.message}`)
})
