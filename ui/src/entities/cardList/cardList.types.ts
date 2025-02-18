import { z } from 'zod'
import { CardListSchema, CardListsSchema } from './cardList.contracts'

export type CardList = z.infer<typeof CardListSchema>
export type CardLists = z.infer<typeof CardListsSchema>