import { z } from 'zod'
import { GetUserResponseDtoSchema } from './user.contracts'

export type GetUserResponseDto = z.infer<typeof GetUserResponseDtoSchema>