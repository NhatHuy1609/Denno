import { z } from 'zod'

const CardListDto = z.object({
  id: z.string(),
  name: z.string(),
  rank: z.string(),
  boardId: z.string()
})

// Requests
export const CreateCardListDtoSchema = z.object({
  name: z.string(),
  boardId: z.string()
}).describe('CreateCardListDtoSchema')

// Responses
export const CardListResponseDtoSchema = CardListDto.describe('CardListResponseDtoSchema')

export const CardListsResponseDtoSchema = z.array(CardListDto).describe('CardListsResponseDtoSchema')

export const CardListsByBoardResponseDtoSchema = CardListsResponseDtoSchema.describe('CardListsByBoardResponseDtoSchema')