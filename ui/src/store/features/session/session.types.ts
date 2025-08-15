import { userSchemas } from '@/entities/user'

export interface Session {
  token: string
  refreshToken: string
}

export type CurrentUser = userSchemas.User
