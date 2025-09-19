import { useQueryClient } from '@tanstack/react-query'
import { CardListQueries, cardListSchemas } from '@/entities/cardList'
import { cardSchemas, cardLib } from '@/entities/card'
import { cardTypesDto } from '@/service/api/card'

type Props = { boardId: string }

export const useCardQueryCacheActions = ({ boardId }: Props) => {
  const queryClient = useQueryClient()
  const queryKey = CardListQueries.cardListsByBoardQuery(boardId).queryKey

  // 1. Move a card between lists
  const moveCard = (oldCardListId: string, newCardListId: string | null, data: cardSchemas.Card) => {
    queryClient.setQueryData(queryKey, (oldData: cardListSchemas.CardList[] | undefined) => {
      if (!oldData) return []

      const newData = [...oldData]
      const { id: updatedCardId } = data

      const oldContainerIndex = oldData.findIndex((c) => c.id === oldCardListId)
      if (oldContainerIndex === -1) return newData
      const oldContainer = oldData[oldContainerIndex]

      // Nếu chuyển card sang list khác
      if (newCardListId) {
        const newContainerIndex = oldData.findIndex((c) => c.id === newCardListId)
        if (newContainerIndex === -1) return newData
        const newContainer = oldData[newContainerIndex]

        newData[oldContainerIndex] = {
          ...oldContainer,
          cards: oldContainer.cards
            ?.filter((card) => card.id !== updatedCardId)
            .sort((a, b) => a.rank.localeCompare(b.rank))
        }

        newData[newContainerIndex] = {
          ...newContainer,
          cards: [...(newContainer.cards ?? []), data].sort((a, b) => a.rank.localeCompare(b.rank))
        }

        return newData
      }

      // Nếu chỉ update card trong cùng list
      const updatedContainer: cardListSchemas.CardList = {
        ...oldContainer,
        cards: oldContainer.cards
          ?.map((card) => (card.id === updatedCardId ? data : card))
          .sort((a, b) => a.rank.localeCompare(b.rank))
      }

      return [...oldData.slice(0, oldContainerIndex), updatedContainer, ...oldData.slice(oldContainerIndex + 1)]
    })
  }

  // 2. Update card field
  const updateCard = (data: cardSchemas.Card) => {
    queryClient.setQueryData(queryKey, (oldData: cardListSchemas.CardList[] | undefined) => {
      if (!oldData) return oldData

      return oldData.map((cardList) =>
        cardList.id !== data.cardListId
          ? cardList
          : {
              ...cardList,
              cards: cardList.cards?.map((card) => (card.id === data.id ? data : card))
            }
      )
    })
  }

  const addCard = (data: cardSchemas.Card) => {
    queryClient.setQueryData(queryKey, (oldData: cardListSchemas.CardList[] | undefined) => {
      if (!oldData) return oldData

      return oldData.map((cardList) =>
        cardList.id !== data.cardListId
          ? cardList
          : {
              ...cardList,
              cards: [...cardList.cards, data]
            }
      )
    })
  }

  return {
    addCard,
    moveCard,
    updateCard
  }
}
