import { z } from 'zod'

// Base Schema
const CardBaseDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  rank: z.string(),
  imageCover: z.string(),
  description: z.string(),
  startDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  reminderDate: z.string().nullable(),
  location: z.string(),
  isWatching: z.boolean(),
  isActive: z.boolean(),
  isOverDue: z.boolean(),
  cardListId: z.string().uuid()
})

// Response Schemas
export const CardResponseDtoSchema = CardBaseDtoSchema.describe('CardResponseDtoSchema')
export const CardsResponseDtoSchema = z.array(CardBaseDtoSchema).describe('CardsResponseDtoSchema')
export const CreateCardResponseDtoSchema = CardBaseDtoSchema.describe('CreateCardResponseDtoSchema')
export const CardsByCardListResponseDtoSchema = z.array(CardBaseDtoSchema).describe('CardsByCardListResponseDtoSchema')
export const UpdateCardRankResponseDtoSchema = CardBaseDtoSchema.describe('UpdateCardRankResponseDtoSchema')

// Request Schemas
export const CreateCardDtoSchema = CardBaseDtoSchema.pick({
  name: true,
  cardListId: true
}).describe('CreateCardRequestDtoSchema')

export const UpdateCardRankDtoSchema = z
  .object({
    previousRank: z.string().nullable(),
    nextRank: z.string().nullable(),
    oldCardListId: z.string(),
    newCardListId: z.string().nullable().default(null),
    boardId: z.string()
  })
  .describe('UpdateCardRankDtoSchema')
