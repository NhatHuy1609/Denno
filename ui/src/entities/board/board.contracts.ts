import { z } from 'zod'
import { enumContracts } from '@/service/api/_enums'
import { userContracts } from '../user'
import { BoardQueryOptionsDto } from '@/service/api/_models/query-models/board/board.contracts'
import { UserSchema } from '../user/user.contracts'
import { WorkspaceSchema } from '../workspace/workspace.contracts'
import { workspaceContracts } from '../workspace'

export const BoardMemberRoleSchema = z.enum(['Member', 'Admin', 'Observer'])

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
  })),
  joinRequests: z.array(z.object({
    id: z.number().int(),
    boardId: z.string(),
    requestedAt: z.string(),
    requester: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      avatar: z.string()
    })
  })),
  workspace: z.object({
    id: z.string().uuid(),
    ownerId: z.string(),
    name: z.string(),
    description: z.string(),
    logoUrl: z.string().optional(),
    visibility: workspaceContracts.WorkspaceVisibilityEnumSchema
  })
})

export const BoardsSchema = z.array(BoardSchema)

export const DetailedBoardInvitationSchema = z.object({
  inviter: UserSchema.pick({
    id: true,
    fullName: true,
    email: true
  }),
  board: BoardSchema.pick({
    id: true,
    name: true
  })
}).describe('DetailedBoardInvitationSchema')

export const BoardJoinRequestSchema = z.object({
  id: z.number(),
  requestedAt: z.string().datetime(),
  boardId: z.string(),
  requester: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatar: z.string()
  })
}).describe('BoardJoinRequestSchema')

export const BoardJoinRequestsSchema = z.array(BoardJoinRequestSchema).describe('BoardJoinRequestsSchema')

// Query Filter
export const BoardQueryFilter = BoardQueryOptionsDto