import { z } from 'zod'
import { 
  LoginUserDtoSchema,
  LoginGoogleDtoSchema,
  LoginResponseDtoSchema,
  RegisterUserDtoSchema, 
  RegisterResponseDtoSchema, 
  ResendRegisterCodeDtoSchema,
  ValidateRegisterUserDtoSchema, 
  LoginGoogleResponseDtoSchema
} from './auth.contracts'

// Request
export type LoginGoogleDto = z.infer<typeof LoginGoogleDtoSchema>
export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>
export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>
export type ResendRegisterCodeDto = z.infer<typeof ResendRegisterCodeDtoSchema>
export type ValidateRegisterUserDto = z.infer<typeof ValidateRegisterUserDtoSchema>

// Response
export type LoginResponseDto = z.infer<typeof LoginResponseDtoSchema>
export type RegisterResponseDto = z.infer<typeof RegisterResponseDtoSchema>
export type LoginGoogleResponseDto = z.infer<typeof LoginGoogleResponseDtoSchema>