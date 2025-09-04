import { httpGet } from '../_req'
import { GetUserResponseDto, UserBoardsResponseDto, UsersResponseDto, UserWorkspacesResponseDto } from './user.types'
import {
  UserBoardsQueryDto,
  UserJoinedBoardQueryDto,
  UsersQueryParamsDto,
  UserWorkspacesQueryParamsDto
} from '../_models/query-models/user/user.types'
import { NotificationResponseDto } from '../notification/notification.types'
import { BoardResponseDto } from '../board/board.types'

export class UserService {
  private static readonly basePath = '/users'

  static usersQuery(config: { signal?: AbortSignal; params?: UsersQueryParamsDto }) {
    return httpGet<UsersResponseDto>(this.basePath, config)
  }

  static loggedInUserQuery(config?: { signal?: AbortSignal }) {
    return httpGet<GetUserResponseDto>(`${this.basePath}/me`, config)
  }

  static userWorkspacesQuery(userId: string, config?: { signal?: AbortSignal; params?: UserWorkspacesQueryParamsDto }) {
    return httpGet<UserWorkspacesResponseDto>(`${this.basePath}/${userId}/workspaces`, config)
  }

  static userNotificationsQuery(userId: string, config?: { signal?: AbortSignal }) {
    return httpGet<NotificationResponseDto[]>(`${this.basePath}/${userId}/notifications`, config)
  }

  static userJoinedBoardsQuery(
    data: { userId: string },
    config?: { signal?: AbortSignal; params?: UserJoinedBoardQueryDto }
  ) {
    return httpGet<BoardResponseDto[]>(`${this.basePath}/${data.userId}/joinedBoards`, config)
  }

  static userBoardsQuery(
    userId: string,
    config?: {
      signal?: AbortSignal
      params?: UserBoardsQueryDto
    }
  ) {
    return httpGet<UserBoardsResponseDto>(`${this.basePath}/${userId}/boards`, config)
  }
}
