import type { userTypesDto } from "@/service/api/user";
import { Users } from "./user.types";

export function transformUsersDtoToUsers(
  usersDto: userTypesDto.UsersResponseDto
): Users {
  const { items } = usersDto

  return {
    ...usersDto,
    users: items
  }
}