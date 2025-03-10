import { createContext, useContext } from 'react'
import { cardListTypes } from '@/entities/cardList'

type CardListContextProps = {
  cardListData?: cardListTypes.CardList
}

const CardListContext = createContext<CardListContextProps>({
  cardListData: undefined
})

export const CardListProvider = CardListContext.Provider

export const useCardListContext = () => {
  return useContext(CardListContext)
}
