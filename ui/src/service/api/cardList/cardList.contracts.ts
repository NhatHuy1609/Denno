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

export const UpdateCardListDtoSchema = z.object({
  name: z.string(),
  rank: z.string() 
}).describe('UpdateCardListDtoSchema')

export const UpdateCardListRankDtoSchema = z.object({
  previousRank: z.string().nullable(),
  nextRank: z.string().nullable()
}).describe("UpdateCardListRankDtoSchema")

// Responses
export const CardListResponseDtoSchema = CardListDto.describe('CardListResponseDtoSchema')
export const CardListsResponseDtoSchema = z.array(CardListDto).describe('CardListsResponseDtoSchema')
export const CardListsByBoardResponseDtoSchema = CardListsResponseDtoSchema.describe('CardListsByBoardResponseDtoSchema')