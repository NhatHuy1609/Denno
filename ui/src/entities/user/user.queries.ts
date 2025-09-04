import { queryOptions } from '@tanstack/react-query'
import { UserService } from '@/service/api/user/user.service'
import {
  transformUserDtoToUser,
  transformUsersDtoToUsers,
  transformUserWorkspacesDtoToUserWorkspaces
} from './user.lib'
import { UserWorkspacesQueryParamsDto } from '@/service/api/_models/query-models/user/user.types'
import { mapToNotifications } from '../notification/notification.lib'
import {
  UserBoardsQuery,
  UserJoinedBoardsFilterQuery,
  UsersFilterQuery,
  UserWorkspacesFilterQuery
} from './user.schemas'
import { userLib } from '.'
import { boardLib } from '../board'

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
      queryKey: [...this.keys.root, 'me'] as unknown[],
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

  static usersNotificationsQuery(userId: string) {
    return queryOptions({
      queryKey: [...this.keys.root, userId, 'notifications'] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await UserService.userNotificationsQuery(userId, { signal })
        return mapToNotifications(response.data)
      }
    })
  }

  static userJoinedBoardsQuery(userId: string, filter?: UserJoinedBoardsFilterQuery) {
    return queryOptions({
      queryKey: [...this.keys.root, userId, 'joinedBoards', filter] as unknown[],
      queryFn: async ({ signal }) => {
        const queryParams = filter && userLib.mapToUserJoinedBoardQueryDto(filter)
        const response = await UserService.userJoinedBoardsQuery({ userId }, { signal, params: queryParams })
        return boardLib.transformBoardsDtoToBoards(response.data)
      }
    })
  }

  static userBoardsQuery(userId: string, filter?: UserBoardsQuery) {
    return queryOptions({
      queryKey: [...this.keys.root, userId, 'boards', filter] as unknown[],
      queryFn: async ({ signal }) => {
        const queryParams = filter && userLib.mapToUserBoardsQueryDto(filter)
        const response = await UserService.userBoardsQuery(userId, { signal, params: queryParams })
        return userLib.mapToUserBoards(response.data)
      }
    })
  }
}
