import { z } from 'zod'
import { UserSchema, UsersFilterQuerySchema, UsersSchema } from './user.contracts'

export type User = z.infer<typeof UserSchema>
export type Users = z.infer<typeof UsersSchema>
export type UsersFilterQuery = z.infer<typeof UsersFilterQuerySchema>