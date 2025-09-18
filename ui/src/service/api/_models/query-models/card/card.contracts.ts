import { z } from 'zod'

export const CardQueryModelDtoSchema = z.object({
  includeCardList: z.boolean().optional().default(false)
})
