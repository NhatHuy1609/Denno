import { z } from 'zod'
import {
  CardResponseDtoSchema,
  CardsByCardListResponseDtoSchema,
  CardsResponseDtoSchema,
  CreateCardDtoSchema,
  CreateCardResponseDtoSchema,
  UpdateCardRankDtoSchema,
  UpdateCardRankResponseDtoSchema
} from './card.contracts'

// Responses
export type CardsResponseDto = z.infer<typeof CardsResponseDtoSchema>
export type CardResponseDto = z.infer<typeof CardResponseDtoSchema>
export type CardsByCardListResponseDto = z.infer<typeof CardsByCardListResponseDtoSchema>
export type CreateCardResponseDto = z.infer<typeof CreateCardResponseDtoSchema>
export type UpdateCardRankResponseDto = z.infer<typeof UpdateCardRankResponseDtoSchema>

// Requests
export type CreateCardDto = z.infer<typeof CreateCardDtoSchema>
export type UpdateCardRankDto = z.infer<typeof UpdateCardRankDtoSchema>