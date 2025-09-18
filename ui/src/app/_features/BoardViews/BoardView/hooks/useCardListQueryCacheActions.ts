import { useQueryClient } from '@tanstack/react-query'
import { cardListTypesDto } from '@/service/api/cardList'
import { CardListQueries, cardListSchemas } from '@/entities/cardList'

type UseCardListQueryCacheActionsProps = {
  boardId: string
}

export const useCardListQueryCacheActions = ({ boardId }: UseCardListQueryCacheActionsProps) => {
  const queryClient = useQueryClient()
  const queryKey = CardListQueries.cardListsByBoardQuery(boardId).queryKey

  // Update 1 cardList
  const updateCardList = (data: cardListSchemas.CardList) => {
    queryClient.setQueryData(queryKey, (oldData) =>
      oldData?.map((list) => (list.id === data.id ? data : list)).sort((a, b) => a.rank.localeCompare(b.rank))
    )
  }

  // Add new cardList
  const addCardList = (data: cardListSchemas.CardList) => {
    queryClient.setQueryData(queryKey, (oldData) =>
      [...(oldData ?? []), data].sort((a, b) => a.rank.localeCompare(b.rank))
    )
  }

  return {
    updateCardList,
    addCardList
  }
}
