import { queryOptions } from "@tanstack/react-query"
import { UserService } from "@/service/api/user/user.service"
import { UsersFilterQuery } from "./user.types"
import { transformUserDtoToUser, transformUsersDtoToUsers } from "./user.lib"

export class UserQueries {
  static readonly keys = {
    root: ['user'] as const,
    list: () => [...this.keys.root, 'list']
  }

  static usersQuery(filter: UsersFilterQuery) {
    return queryOptions({
      queryKey: [...this.keys.list(), filter],
      queryFn: async ({ signal }) => {
        const config = {
          signal,
          params: filter
        }

        const response = await UserService.usersQuery(config)
        return transformUsersDtoToUsers(response.data)
      }
    })
  }

  static loggedInUserQuery() {
    return queryOptions({
      queryKey: [...this.keys.root, 'me'],
      queryFn: async ({ signal }) => {
        const response = await UserService.loggedInUserQuery()
        return transformUserDtoToUser(response.data)
      }
    })
  }
}