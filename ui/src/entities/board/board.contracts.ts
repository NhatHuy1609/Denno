import { z } from 'zod'
import { enumContracts } from '@/service/api/_enums'
import { userContracts } from '../user'
import { BoardQueryOptionsDto } from '@/service/api/_models/query-models/board/board.contracts'

export const BoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  background: z.string(),
  starredStatus: z.boolean(),
  workspaceId: z.string(),
  visibility: enumContracts.BoardVisibilityEnumSchema,

  members: z.array(z.object({
    memberId: z.string(),
    member: userContracts.UserSchema,
    boardMemberRole: z.string()
  }))
})

export const BoardsSchema = z.array(BoardSchema)

// Query Filter
export const BoardQueryFilter = BoardQueryOptionsDto