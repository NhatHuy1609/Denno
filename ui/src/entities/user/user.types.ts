import { z } from 'zod'
import { 
  UserSchema,
  UsersSchema,
  UsersFilterQuerySchema,
  UserWorkspacesFilterQuerySchema, 
  UserWorkspacesSchema
} from './user.contracts'

export type User = z.infer<typeof UserSchema>
export type Users = z.infer<typeof UsersSchema>
export type UserWorkspaces = z.infer<typeof UserWorkspacesSchema>
export type UserWorkspace = UserWorkspaces[0]
export type UsersFilterQuery = z.infer<typeof UsersFilterQuerySchema>
export type UserWorkspacesFilterQuery = z.infer<typeof UserWorkspacesFilterQuerySchema>