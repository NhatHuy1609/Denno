import { cardSchemas } from '@/entities/card'
import { userSchemas } from '@/entities/user'
import { createContext, useContext } from 'react'

type CardDetailModalContextProps = {
  boardId: string
  cardListId: string
  cardId: string
  cardData?: cardSchemas.Card
  cardMembers?: userSchemas.User[]
  refetchCard: () => void
  registerActionPopoverRef: (ref: React.RefObject<HTMLDivElement>) => void
}

export const CardDetailModalContext = createContext<CardDetailModalContextProps | null>(null)

export const CardDetailModalProvider = CardDetailModalContext.Provider

export const useCardDetailModalContext = () => {
  const cardDetailModalContext = useContext(CardDetailModalContext)

  if (!cardDetailModalContext) {
    return {} as Partial<CardDetailModalContextProps>
  }

  return cardDetailModalContext
}
