import { z } from 'zod'
import { BoardMemberRoleSchema, BoardQueryFilter, BoardSchema, BoardsSchema } from './board.contracts'

export type Board = z.infer<typeof BoardSchema>
export type Boards = z.infer<typeof BoardsSchema>
export type BoardQueryFilter = z.infer<typeof BoardQueryFilter>
export type BoardMemberRole = z.infer<typeof BoardMemberRoleSchema>