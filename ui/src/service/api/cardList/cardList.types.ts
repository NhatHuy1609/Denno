import { z } from 'zod'
import { 
  CardListsResponseDtoSchema,
  CardListResponseDtoSchema,
  CardListsByBoardResponseDtoSchema,
  CreateCardListDtoSchema, 
  UpdateCardListDtoSchema,
  UpdateCardListRankDtoSchema
} from './cardList.contracts'

export type CreateCardListDto = z.infer<typeof CreateCardListDtoSchema>
export type UpdateCardListDto = z.infer<typeof UpdateCardListDtoSchema>
export type UpdateCardListRankDto = z.infer<typeof UpdateCardListRankDtoSchema>
export type CardListResponseDto = z.infer<typeof CardListResponseDtoSchema>
export type CardListsResponseDto = z.infer<typeof CardListsResponseDtoSchema>
export type CardListsByBoardResponseDto = z.infer<typeof CardListsByBoardResponseDtoSchema>
