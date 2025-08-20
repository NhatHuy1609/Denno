import type { userSchemasDto } from '@/service/api/user'
import { User, UserJoinedBoardsFilterQuery, Users, UserWorkspaces } from './user.schemas'
import { UserJoinedBoardQueryDto } from '@/service/api/_models/query-models/user/user.types'

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
