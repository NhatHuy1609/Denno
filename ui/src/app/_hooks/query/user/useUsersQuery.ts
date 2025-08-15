import { UserQueries } from '@/entities/user'
import { useQuery } from '@tanstack/react-query'
import { userSchemas } from '@/entities/user'

export const useUsersQuery = (filter: userSchemas.UsersFilterQuery) => {
  const { email } = filter

  return useQuery({
    ...UserQueries.usersQuery(filter),
    enabled: !!email
  })
}
