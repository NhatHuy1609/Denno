import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'
import { CardListQueries, cardListSchemas } from '@/entities/cardList'

export const useCardListQuery = (cardListId: string, options?: ApiQueryOptionsParams<cardListSchemas.CardList>) => {
  const queryOptions = CardListQueries.cardListQuery(cardListId)
  return useApiQueryWrapper(queryOptions, options)
}
