import { UserQueries, userTypes } from '@/entities/user'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useMe = (options?: ApiQueryOptionsParams<userTypes.User>) => {
  const queryOptions = UserQueries.loggedInUserQuery()

  return useApiQueryWrapper(queryOptions, options)
}
