import { z } from 'zod'
import { NotificationResponseDtoSchema } from './notification.contracts'

export type NotificationResponseDto = z.infer<typeof NotificationResponseDtoSchema>