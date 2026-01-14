import { z } from 'zod'

export interface User {
  id: string
  email: string
  name: string
  password: string
  createdAt: Date
}

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserDTO = z.infer<typeof createUserSchema>
export type UpdateUserDTO = z.infer<typeof updateUserSchema>
