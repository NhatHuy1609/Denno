import { z } from 'zod'
import { userContractsDto } from '../user'

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
  isCompleted: z.boolean(),
  cardListId: z.string().uuid(),

  members: z.lazy(() => userContractsDto.GetUserResponseDtoSchema.array())
})

// Response Schemas
export const CardResponseDtoSchema = CardBaseDtoSchema.describe('CardResponseDtoSchema')
export const CardsResponseDtoSchema = z.array(CardBaseDtoSchema).describe('CardsResponseDtoSchema')
export const CreateCardResponseDtoSchema = CardBaseDtoSchema.describe('CreateCardResponseDtoSchema')
export const CardsByCardListResponseDtoSchema = z.array(CardBaseDtoSchema).describe('CardsByCardListResponseDtoSchema')
export const UpdateCardRankResponseDtoSchema = CardBaseDtoSchema.describe('UpdateCardRankResponseDtoSchema')

export const CardMembersResponseDtoSchema = z.object({
  cardId: z.string().uuid(),
  members: z.lazy(() => userContractsDto.GetUserResponseDtoSchema.array())
})

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

export const AssignCardMemberDtoSchema = z
  .object({
    assignedMemberId: z.string()
  })
  .describe('AssignCardMemberDtoSchema')

export const RemoveCardMemberDtoSchema = z
  .object({
    memberId: z.string()
  })
  .describe('RemoveCardMemberDtoSchema')

export const UpdateCardDtoSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional()
  })
  .describe('UpdateCardDtoSchema')

export const UpdateCardDatesDtoSchema = z
  .object({
    dueDate: z.string().optional(),
    startDate: z.string().optional()
  })
  .describe('UpdateCardDatesDtoSchema')
