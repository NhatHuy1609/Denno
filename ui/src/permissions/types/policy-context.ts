import { userTypes } from "@/entities/user"

export type PolicyContext = {
  user: userTypes.User
  [key: string]: any
}