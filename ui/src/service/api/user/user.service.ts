import { httpGet } from "../_req";
import { GetUserResponseDto, UsersResponseDto } from "./user.types";
import { UsersQueryParamsDto } from "../_models/query-models/user/user.types";

export class UserService {
  static usersQuery(config: { signal?: AbortSignal, params?: UsersQueryParamsDto }) {
    return httpGet<UsersResponseDto>(`/users`, config)
  }

  static loggedInUserQuery(config?: { signal?: AbortSignal }) {
    return httpGet<GetUserResponseDto>('/users/me', config)
  }
}