import { userSchemas } from '@/entities/user'

export type PolicyContext = {
  user: userSchemas.User
  [key: string]: any
}
