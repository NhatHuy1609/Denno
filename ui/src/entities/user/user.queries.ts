import { queryOptions } from "@tanstack/react-query"
import { UserService } from "@/service/api/user/user.service"
import { UsersFilterQuery, UserWorkspacesFilterQuery } from "./user.types"
import { transformUserDtoToUser, transformUsersDtoToUsers, transformUserWorkspacesDtoToUserWorkspaces } from "./user.lib"
import { UserWorkspacesQueryParamsDto } from "@/service/api/_models/query-models/user/user.types"

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

  static userWorkspacesQuery(userId: string, filter?: UserWorkspacesFilterQuery) {
    const params = {
      ...filter
    } as UserWorkspacesQueryParamsDto

    return queryOptions({
      queryKey: [...this.keys.root, userId, 'workspaces'],
      queryFn: async ({ signal }) => {
        const response = await UserService.userWorkspacesQuery(userId, { signal, params })
        return transformUserWorkspacesDtoToUserWorkspaces(response.data)
      }
    })
  }
}