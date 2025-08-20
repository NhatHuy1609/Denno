import { UserQueries } from '@/entities/user'
import { useApiQueryWrapper } from '../useApiQueryWrapper'
import type { userSchemas } from '@/entities/user'
import type { boardSchemas } from '@/entities/board'
import type { ApiQueryOptionsParams } from '../types'

export const useUserJoinedBoardsQuery = (
  userId: string,
  filter?: userSchemas.UserJoinedBoardsFilterQuery,
  options?: ApiQueryOptionsParams<boardSchemas.Board[]>
) => {
  const queryOptions = UserQueries.userJoinedBoardsQuery(userId, filter)

  return useApiQueryWrapper(queryOptions, options)
}
