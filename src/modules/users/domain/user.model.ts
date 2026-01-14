import { z } from 'zod'

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
})

export type CreateUserDTO = z.infer<typeof createUserSchema>
