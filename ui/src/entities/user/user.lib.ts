import type { userTypesDto } from "@/service/api/user";
import { User, Users, UserWorkspaces } from "./user.types";

export function transformUserDtoToUser(
  userDto: userTypesDto.GetUserResponseDto
): User {
  return {
    ...userDto
  }
}

export function transformUsersDtoToUsers(
  usersDto: userTypesDto.UsersResponseDto
): Users {
  const { items } = usersDto

  return {
    ...usersDto,
    users: items
  }
}

export function transformUserWorkspacesDtoToUserWorkspaces(
  userWorkspacesDto: userTypesDto.UserWorkspacesResponseDto
): UserWorkspaces {
  return userWorkspacesDto.map((userWorkspace) => ({
    ...userWorkspace,
  }))
}