import { cardLib, CardQueries } from '@/entities/card'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useCardMembersQuery = (
  cardId: string,
  options?: ApiQueryOptionsParams<ReturnType<typeof cardLib.normalizeCardMembersDto>>
) => {
  const queryOptions = CardQueries.cardMembersQuery(cardId)
  return useApiQueryWrapper(queryOptions, options)
}
