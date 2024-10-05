import { z } from 'zod'

export const GetUserResponseDtoSchema = z.object({
  email: z.string(),
  avatar: z.string(),
  fullName: z.string()
})