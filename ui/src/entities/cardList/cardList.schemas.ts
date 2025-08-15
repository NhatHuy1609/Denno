import { Cards } from '../card/card.schemas'

export interface CardList {
  id: string
  name: string
  rank: string
  boardId: string
  cards: Cards
}

export type CardLists = CardList[]
