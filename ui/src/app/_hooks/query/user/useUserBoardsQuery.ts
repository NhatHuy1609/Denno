import { UserQueries } from '@/entities/user'
import { useApiQueryWrapper } from '../useApiQueryWrapper'
import type { userSchemas } from '@/entities/user'
import type { ApiQueryOptionsParams } from '../types'
import { mapToUserBoards } from '@/entities/user/user.lib'

export const useUserBoardsQuery = (
  userId: string,
  filter?: userSchemas.UserBoardsQuery,
  options?: ApiQueryOptionsParams<ReturnType<typeof mapToUserBoards>>
) => {
  const queryOptions = UserQueries.userBoardsQuery(userId, filter)

  return useApiQueryWrapper(queryOptions, options)
}
