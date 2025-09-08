import { useQueryClient } from '@tanstack/react-query'
import { cardListTypesDto } from '@/service/api/cardList'
import { CardListQueries } from '@/entities/cardList'

type UpdateCardListsOfBoardQueryCacheProps = {
  boardId: string
}

export const useUpdateCardListsOfBoardQueryCache = ({ boardId }: UpdateCardListsOfBoardQueryCacheProps) => {
  const queryClient = useQueryClient()

  const updateCardListsOfBoardQueryCache = (data: cardListTypesDto.CardListResponseDto) => {
    const { id: updatedCardListId } = data
    queryClient.setQueryData(CardListQueries.cardListsByBoardQuery(boardId).queryKey, (oldData) => {
      return oldData
        ?.map((cardList) => (cardList.id === updatedCardListId ? data : cardList))
        .sort((a, b) => a.rank.localeCompare(b.rank))
    })
  }

  return {
    updateQueryCache: updateCardListsOfBoardQueryCache
  }
}
