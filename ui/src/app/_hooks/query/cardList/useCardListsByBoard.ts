import { CardListQueries, cardListSchemas } from '@/entities/cardList'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useCardListsOfBoardQuery = (
  boardId: string,
  options?: ApiQueryOptionsParams<cardListSchemas.CardLists>
) => {
  const queryOptions = CardListQueries.cardListsByBoardQuery(boardId)

  return useApiQueryWrapper(queryOptions, options)
}
