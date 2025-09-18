import { CardQueries, cardSchemas } from '@/entities/card'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useCardsOfCardListQuery = (cardListId: string, options?: ApiQueryOptionsParams<cardSchemas.Cards>) => {
  const queryOptions = CardQueries.cardsByCardListQuery(cardListId)

  return useApiQueryWrapper(queryOptions, options)
}
