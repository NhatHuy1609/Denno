import { userSchemas } from '@/entities/user'

export type PolicyContext = {
  user: userSchemas.User // The actor performing the action on the resource
  [key: string]: any
}
