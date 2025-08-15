import type { userSchemasDto } from '@/service/api/user'
import { User, Users, UserWorkspaces } from './user.schemas'

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
