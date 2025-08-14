import { z } from 'zod'
import { UserSchema } from '../user/user.contracts'
import { userContracts } from '../user'
import { boardContracts } from '../board'

export const WorkspaceVisibilityEnumSchema = z.enum(['Public', 'Private', 'Workspace'])
export const WorkspaceMemberTypeEnumSchema = z.enum(['Normal', 'Admin'])

export const WorkspaceSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    idOwner: z.string(),
    logo: z.string().nullable(),
    visibility: WorkspaceVisibilityEnumSchema,
    boardCounts: z
      .array(
        z.object({
          idMember: z.string(),
          boardCount: z.number()
        })
      )
      .optional(),
    members: z
      .array(
        z.object({
          id: z.string(),
          email: z.string(),
          avatar: z.string(),
          fullName: z.string(),
          memberType: WorkspaceMemberTypeEnumSchema
        })
      )
      .optional(),
    joinRequests: z
      .array(
        z.object({
          id: z.string(),
          requester: z.object({
            id: z.string(),
            avatar: z.string(),
            name: z.string(),
            email: z.string()
          })
        })
      )
      .optional(),
    guests: z.array(
      z.object({
        user: userContracts.UserSchema.pick({
          id: true,
          fullName: true,
          email: true,
          avatar: true
        }),
        joinedBoards: z.array(
          boardContracts.BoardSchema.pick({
            id: true,
            name: true,
            background: true
          })
        )
      })
    )
  })
  .describe('WorkspaceSchema')

export const WorkspacesSchema = z.array(WorkspaceSchema).describe('WorkspacesSchema')

export const WorkspaceFilterQuerySchema = z
  .object({
    fields: z.string().default('').optional(),
    boardCounts: z.coerce.boolean().default(false).optional(),
    members: z.coerce.boolean().default(false).optional(),
    joinRequests: z.coerce.boolean().default(false).optional(),
    memberFields: z.string().optional(),
    includeGuests: z.coerce.boolean().default(false).optional()
  })
  .optional()
  .describe('WorkspaceFilterQuerySchema')

export const DetailedWorkspaceInvitationSchema = z
  .object({
    inviter: UserSchema.pick({
      id: true,
      fullName: true,
      email: true
    }),
    workspace: WorkspaceSchema.pick({
      id: true,
      name: true
    })
  })
  .describe('DetailedWorkspaceInvitationSchema')

export const WorkspaceJoinRequestSchema = z
  .object({
    id: z.number(),
    requestedAt: z.string().datetime(),
    workspaceId: z.string(),
    requester: UserSchema.pick({
      id: true,
      fullName: true,
      email: true,
      avatar: true
    })
  })
  .describe('WorkspaceJoinRequestSchema')

export const WorkspaceJoinRequestsSchema = z.array(WorkspaceJoinRequestSchema).describe('WorkspaceJoinRequestsSchema')
