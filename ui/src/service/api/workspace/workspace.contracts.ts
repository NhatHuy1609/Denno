import { z } from 'zod'

export const CreateWorkspaceDtoSchema = z.object({
  name: z
    .string({ required_error: 'Name required!' })
    .min(1, { message: 'Name required!' }),
  description: z
    .string({ required_error: 'Description required!' })
    .min(1, { message: 'Description required!' })
})