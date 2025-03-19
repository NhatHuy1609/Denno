import { UserQueries } from "@/entities/user"
import { useQuery } from "@tanstack/react-query"
import { userTypes } from "@/entities/user"

export const useUsersQuery = (filter: userTypes.UsersFilterQuery) => {
  const { email } = filter

  return useQuery(
    {
      ...UserQueries.usersQuery(filter),
      enabled: !!email      
    }
  )
}