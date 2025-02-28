import { z } from 'zod'

export const CardListSchema = z.object({
  id: z.string(),
  name: z.string(),
  rank: z.string(),
  boardId: z.string()
})

export const CardListsSchema = z.array(CardListSchema)