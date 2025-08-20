import { z } from 'zod'
import {
  UserJoinedBoardQueryDtoSchema,
  UsersQueryParamsDtoSchema,
  UserWorkspacesQueryDtoSchema
} from './user.contracts'

export type UsersQueryParamsDto = z.infer<typeof UsersQueryParamsDtoSchema>
export type UserWorkspacesQueryParamsDto = z.infer<typeof UserWorkspacesQueryDtoSchema>
export type UserJoinedBoardQueryDto = z.infer<typeof UserJoinedBoardQueryDtoSchema>
