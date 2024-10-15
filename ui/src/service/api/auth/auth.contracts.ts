import { z } from 'zod'
import { GetUserResponseDtoSchema } from '../user/user.contracts'

// RequestsDto ============================================================================

export const LoginGoogleDtoSchema = z.object({
  authorizationCode: z.string()
})

export const LoginUserDtoSchema = z.object({
  email: z
    .string({ required_error: 'Email required!' })
    .min(1, { message: 'Email required!' })
    .email({ message: 'This email is invalid' }),
  password: z 
    .string({required_error: 'Password required!'})
    .min(8, {message: 'Password must be 8 characters or longer!'})
})

export const RegisterUserDtoSchema = z.object({
  email: z
    .string({ required_error: 'Email required!' })
    .min(1, { message: 'Email required!' })
    .email({ message: 'This email is invalid' }),
  fullName: z
    .string({ required_error: 'Full name required!' })
    .min(1, "Full name required!")
    .max(50, "Your name is too long"),
  password: z
    .string({ required_error: 'Password required!' })
    .min(8, {message: 'Password must contain at least 8 character(s)'})
}).required()

export const ValidateRegisterUserDtoSchema = z.object({
  email: z.string(),
  code: z.string()
})

export const ResendRegisterCodeDtoSchema = z.object({
  email: z.string()
})

// ResponseDto ============================================================================

export const RegisterResponseDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  message: z.string(),
  requiresRegistration: z.boolean()
})

export const LoginResponseDtoSchema = z.object({
  success: z.boolean(),
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const LoginGoogleResponseDtoSchema = z.object({
  message: z.string(),
  requiresRegistration: z.boolean(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  userInfo: GetUserResponseDtoSchema
})



