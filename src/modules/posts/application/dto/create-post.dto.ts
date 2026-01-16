import { z } from 'zod'

export const createPostSchema = z.object({
   title: z.string().min(3),
   content: z.string().min(10),
})

export type CreatePostDTO = z.infer<typeof createPostSchema>
