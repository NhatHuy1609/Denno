import { z } from 'zod'
import { cardTypes } from '../card'
import { CardsResponseDtoSchema } from '@/service/api/card/card.contracts'

export const CardListSchema = z.object({
  id: z.string(),
  name: z.string(),
  rank: z.string(),
  boardId: z.string(),
  cards: CardsResponseDtoSchema
})

export const CardListsSchema = z.array(CardListSchema)