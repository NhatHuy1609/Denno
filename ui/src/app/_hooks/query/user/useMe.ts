import { useQuery } from "@tanstack/react-query"
import { UserQueries } from "@/entities/user"

export const useMe = () => {
  return useQuery(UserQueries.loggedInUserQuery())
}