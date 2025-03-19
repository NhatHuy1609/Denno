import { z } from 'zod'
import { UsersQueryParamsDtoSchema } from './user.contracts'

export type UsersQueryParamsDto = z.infer<typeof UsersQueryParamsDtoSchema>