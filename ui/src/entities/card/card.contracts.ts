import { z } from 'zod'

const CardBaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  rank: z.string(),
  imageCover: z.string(),
  description: z.string(),
  startDate: z.string(),
  dueDate: z.string(),
  reminderDate: z.string(),
  location: z.string(),
  isWatching: z.boolean(),
  isActive: z.boolean(),
  cardListId: z.string().uuid()
})

export const CardSchema = CardBaseSchema.describe("CardSchema")
export const CardsSchema = z.array(CardBaseSchema).describe("CardsSchema")