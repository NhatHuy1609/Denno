import { cardLib, CardQueries, cardSchemas } from '@/entities/card'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useCardQuery = (
  cardId: string,
  filter?: cardSchemas.CardQuery,
  options?: ApiQueryOptionsParams<ReturnType<typeof cardLib.normalizeCardDto>>
) => {
  const queryOptions = CardQueries.cardQuery(cardId, filter)
  return useApiQueryWrapper(queryOptions, options)
}
