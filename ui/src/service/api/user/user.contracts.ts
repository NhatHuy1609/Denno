import { z } from 'zod'

export const GetUserResponseDtoSchema = z.object({
  id: z.string().nullable(),
  email: z.string(),
  avatar: z.string(),
  fullName: z.string()
})