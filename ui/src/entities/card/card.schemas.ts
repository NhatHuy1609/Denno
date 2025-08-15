export interface Card {
  id: string
  name: string
  rank: string
  imageCover: string
  description: string
  startDate: string
  dueDate: string
  reminderDate: string
  location: string
  isWatching: boolean
  isActive: boolean
  cardListId: string
}

export type Cards = Card[]
