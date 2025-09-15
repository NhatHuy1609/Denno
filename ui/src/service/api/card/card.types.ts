import { z } from 'zod'
import {
  AssignCardMemberDtoSchema,
  CardMembersResponseDtoSchema,
  CardResponseDtoSchema,
  CardsByCardListResponseDtoSchema,
  CardsResponseDtoSchema,
  CreateCardDtoSchema,
  CreateCardResponseDtoSchema,
  RemoveCardMemberDtoSchema,
  UpdateCardDatesDtoSchema,
  UpdateCardDtoSchema,
  UpdateCardRankDtoSchema,
  UpdateCardRankResponseDtoSchema
} from './card.contracts'

// Responses
export type CardsResponseDto = z.infer<typeof CardsResponseDtoSchema>
export type CardResponseDto = z.infer<typeof CardResponseDtoSchema>
export type CardsByCardListResponseDto = z.infer<typeof CardsByCardListResponseDtoSchema>
export type CreateCardResponseDto = z.infer<typeof CreateCardResponseDtoSchema>
export type UpdateCardRankResponseDto = z.infer<typeof UpdateCardRankResponseDtoSchema>
export type CardMembersResponseDto = z.infer<typeof CardMembersResponseDtoSchema>

// Requests
export type CreateCardDto = z.infer<typeof CreateCardDtoSchema>
export type UpdateCardDto = z.infer<typeof UpdateCardDtoSchema>
export type UpdateCardRankDto = z.infer<typeof UpdateCardRankDtoSchema>
export type AssignCardMemberDto = z.infer<typeof AssignCardMemberDtoSchema>
export type RemoveCardMemberDto = z.infer<typeof RemoveCardMemberDtoSchema>
export type UpdateCardDatesDto = z.infer<typeof UpdateCardDatesDtoSchema>
