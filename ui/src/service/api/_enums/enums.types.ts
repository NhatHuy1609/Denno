import { z } from 'zod'
import { BoardMemberRoleEnumSchema, BoardVisibilityEnumSchema, MemberRoleEnumSchema } from './enums.contracts'

export type BoardVisibilityEnum = z.infer<typeof BoardVisibilityEnumSchema>
export type MemberRoleEnum = z.infer<typeof MemberRoleEnumSchema>
export type BoardMemberRoleEnum = z.infer<typeof BoardMemberRoleEnumSchema>