import { httpGet } from "../_req";
import { GetUserResponseDto, UsersResponseDto, UserWorkspacesResponseDto } from "./user.types";
import { UsersQueryParamsDto, UserWorkspacesQueryParamsDto } from "../_models/query-models/user/user.types";

export class UserService {
  private static readonly basePath = '/users'

  static usersQuery(config: { signal?: AbortSignal, params?: UsersQueryParamsDto }) {
    return httpGet<UsersResponseDto>(this.basePath, config)
  }

  static loggedInUserQuery(config?: { signal?: AbortSignal }) {
    return httpGet<GetUserResponseDto>(`${this.basePath}/me`, config)
  }

  static userWorkspacesQuery(userId: string, config?: { signal?: AbortSignal, params?: UserWorkspacesQueryParamsDto }) {
    return httpGet<UserWorkspacesResponseDto>(`${this.basePath}/${userId}/workspaces`, config)
  }
}