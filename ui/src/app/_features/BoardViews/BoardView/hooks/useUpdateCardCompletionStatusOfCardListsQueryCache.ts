import { cardLib } from '@/entities/card'
import { CardListQueries } from '@/entities/cardList'
import { cardTypesDto } from '@/service/api/card'
import { useQueryClient } from '@tanstack/react-query'

export const useUpdateCardCompletionStatusQueryCache = ({ boardId }: { boardId: string }) => {
  const queryClient = useQueryClient()

  const updateCardCompletionStatusQueryCache = (data: cardTypesDto.CardResponseDto) => {
    const { id: updatedCardId, cardListId } = data
    const updatedCard = cardLib.transformCardDtoToCard(data)

    queryClient.setQueryData(CardListQueries.cardListsByBoardQuery(boardId).queryKey, (oldData) => {
      if (!oldData) return oldData

      return oldData.map((cardList) => {
        if (cardList.id !== cardListId) return cardList

        return {
          ...cardList,
          cards: cardList.cards?.map((card) => (card.id === updatedCardId ? updatedCard : card))
        }
      })
    })
  }

  return {
    updateQueryCache: updateCardCompletionStatusQueryCache
  }
}
