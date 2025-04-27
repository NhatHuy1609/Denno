import { z } from 'zod'
import { BoardVisibilityEnumSchema, MemberRoleEnumSchema } from './enums.contracts'

export type BoardVisibilityEnum = z.infer<typeof BoardVisibilityEnumSchema>
export type MemberRoleEnum = z.infer<typeof MemberRoleEnumSchema>