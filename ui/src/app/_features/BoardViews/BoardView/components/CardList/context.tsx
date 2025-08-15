import { createContext, useContext } from 'react'
import { cardListSchemas } from '@/entities/cardList'

type CardListContextProps = {
  cardListData?: cardListSchemas.CardList
}

const CardListContext = createContext<CardListContextProps>({
  cardListData: undefined
})

export const CardListProvider = CardListContext.Provider

export const useCardListContext = () => {
  return useContext(CardListContext)
}
