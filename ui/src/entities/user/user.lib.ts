import type { userTypesDto } from "@/service/api/user";
import { User, Users } from "./user.types";

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