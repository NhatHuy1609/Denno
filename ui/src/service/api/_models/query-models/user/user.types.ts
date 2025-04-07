import { z } from 'zod'
import { UsersQueryParamsDtoSchema, UserWorkspacesQueryDtoSchema } from './user.contracts'

export type UsersQueryParamsDto = z.infer<typeof UsersQueryParamsDtoSchema>
export type UserWorkspacesQueryParamsDto = z.infer<typeof UserWorkspacesQueryDtoSchema>