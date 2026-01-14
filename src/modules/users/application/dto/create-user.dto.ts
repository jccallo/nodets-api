import { z } from 'zod'

export const createUserSchema = z.object({
   email: z.string().email('Email inválido'),
   name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
   password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type CreateUserDTO = z.infer<typeof createUserSchema>
