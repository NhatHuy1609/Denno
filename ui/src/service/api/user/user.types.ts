import { z } from 'zod'
import { 
  GetUserResponseDtoSchema, 
  UsersResponseDtoSchema, 
  UserWorkspacesResponseDtoSchema 
} from './user.contracts'

// Responses
export type GetUserResponseDto = z.infer<typeof GetUserResponseDtoSchema>
export type UsersResponseDto = z.infer<typeof UsersResponseDtoSchema>
export type UserWorkspacesResponseDto = z.infer<typeof UserWorkspacesResponseDtoSchema>
