import { useQueryClient } from '@tanstack/react-query'
import { CardListQueries, cardListSchemas } from '@/entities/cardList'
import { cardSchemas } from '@/entities/card'
import { cardTypesDto } from '@/service/api/card'

type UpdateCardsOfCardListQueryCacheProps = {
  boardId: string
}

export const useUpdateCardsOfCardListQueryCache = ({ boardId }: UpdateCardsOfCardListQueryCacheProps) => {
  const queryClient = useQueryClient()

  const updateCardsOfCardListQueryCache = (
    oldCardListId: string,
    newCardListId: string | null,
    data: cardTypesDto.CardResponseDto
  ) => {
    const { id: updatedCardId } = data
    queryClient.setQueryData(CardListQueries.cardListsByBoardQuery(boardId as string).queryKey, (oldData) => {
      if (!oldData) {
        return []
      }

      // Clone the data to avoid direct mutations
      const newData = [...oldData]

      // Takes cardlist container contains the updated card and container's indices
      const oldContainer = oldData?.find((cardList) => cardList.id === oldCardListId)
      const oldContainerIndex = oldData?.findIndex((c) => c.id === oldCardListId) as number

      if (oldContainerIndex === -1 || !oldContainer) return newData

      // Creates new cardlist container because of changes in cards of old cardlist
      if (newCardListId) {
        const newContainer = oldData?.find((cardList) => cardList.id === newCardListId)
        const newContainerIndex = oldData?.findIndex((c) => c.id === newCardListId) as number

        if (newContainerIndex === -1 || !newContainer) return newData

        newData[oldContainerIndex] = {
          ...oldContainer,
          cards: oldContainer?.cards
            .filter((card) => card.id !== updatedCardId)
            .sort((a, b) => a.rank.localeCompare(b.rank))
        }

        console.log('OLD CONTAINER: ', newData[oldContainerIndex])
        newData[newContainerIndex] = {
          ...newContainer,
          cards: [...(newContainer?.cards as cardSchemas.Cards), data].sort((a, b) => a.rank.localeCompare(b.rank))
        }

        return newData
      } else {
        const updatedContainer = {
          ...oldContainer,
          cards: oldContainer?.cards
            .map((card) => (card.id === updatedCardId ? data : card))
            .sort((a, b) => a.rank.localeCompare(b.rank))
        } as cardListSchemas.CardList

        return [
          ...(oldData?.slice(0, oldContainerIndex) || []),
          updatedContainer,
          ...(oldData?.slice(oldContainerIndex + 1) || [])
        ]
      }
    })
  }

  return {
    updateQueryCache: updateCardsOfCardListQueryCache
  }
}
