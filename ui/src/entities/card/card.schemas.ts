export interface Card {
  id: string
  name: string
  rank: string
  imageCover: string
  description: string
  startDate: string | null
  dueDate: string | null
  reminderDate: string | null
  location: string
  isWatching: boolean
  isActive: boolean
  isOverDue: boolean
  isCompleted: boolean
  cardListId: string

  memberIds: string[]
}

export type Cards = Card[]

export type CardQuery = {
  includeCardList: boolean
}
