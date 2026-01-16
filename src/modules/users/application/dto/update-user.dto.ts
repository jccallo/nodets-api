import { z } from 'zod'
import { createUserSchema } from '@/modules/users/application/dto/create-user.dto'

export const updateUserSchema = createUserSchema.partial()

export type UpdateUserDTO = z.infer<typeof updateUserSchema>
