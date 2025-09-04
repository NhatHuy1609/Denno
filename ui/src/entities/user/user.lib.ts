import type { userSchemasDto } from '@/service/api/user'
import { User, UserBoardsQuery, UserJoinedBoardsFilterQuery, Users, UserWorkspaces } from './user.schemas'
import { UserBoardsQueryDto, UserJoinedBoardQueryDto } from '@/service/api/_models/query-models/user/user.types'
import { transformBoardDtoToBoard } from '../board/board.lib'

export function transformUserDtoToUser(userDto: userSchemasDto.GetUserResponseDto): User {
  return {
    ...userDto
  }
}

export function transformUsersDtoToUsers(usersDto: userSchemasDto.UsersResponseDto): Users {
  const { items } = usersDto

  return {
    ...usersDto,
    users: items
  }
}

export function transformUserWorkspacesDtoToUserWorkspaces(
  userWorkspacesDto: userSchemasDto.UserWorkspacesResponseDto
): UserWorkspaces {
  return userWorkspacesDto.map((userWorkspace) => ({
    ...userWorkspace
  }))
}

export function mapToUserJoinedBoardQueryDto(queryDto: UserJoinedBoardsFilterQuery): UserJoinedBoardQueryDto {
  return {
    workspaceId: queryDto.workspaceId
  }
}

export function mapToUserBoards(dto: userSchemasDto.UserBoardsResponseDto) {
  return {
    boards: dto.boards.map((board) => transformBoardDtoToBoard(board)),
    starredBoards: dto.starredBoards.map((board) => transformBoardDtoToBoard(board))
  }
}

export function mapToUserBoardsQueryDto(queryDto: UserBoardsQuery): UserBoardsQueryDto {
  return {
    starredBoards: queryDto.starredBoards
  }
}
