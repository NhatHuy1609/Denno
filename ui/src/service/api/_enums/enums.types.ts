import { z } from 'zod'
import { BoardVisibilityEnumSchema } from './enums.contracts'

export type BoardVisibilityEnum = z.infer<typeof BoardVisibilityEnumSchema>