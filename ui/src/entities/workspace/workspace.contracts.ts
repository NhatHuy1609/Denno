import { z } from 'zod'
import { UserSchema } from '../user/user.contracts';

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  idOwner: z.string(),
  logo: z.string().nullable(),
  visibility: z.enum(['Private', 'Workspace', 'Public']),
  boardCounts: z.array(z.object({
    idMember: z.string(),
    boardCount: z.number(),
  })).optional(),
  members: z.array(z.object({
    id: z.string(),
    email: z.string(),
    avatar: z.string(),
    fullName: z.string(),
    memberType: z.enum(['Normal', 'Admin']),
  })).optional(),
}).describe('WorkspaceResponseDtoSchema')

export const WorkspacesSchema = z.array(WorkspaceSchema)

export const WorkspaceFilterQuerySchema = z.object({
  fields: z.string().default("").optional(),
  boardCounts: z.coerce.boolean().default(false).optional(),
  members: z.coerce.boolean().default(false).optional(),
  memberFields: z.string().optional()
}).optional().describe('WorkspaceFilterQuerySchema');

export const DetailedWorkspaceInvitationSchema = z.object({
  inviter: UserSchema.pick({
    id: true,
    fullName: true,
    email: true
  }),
  workspace: WorkspaceSchema.pick({
    id: true,
    name: true
  })
}).describe('DetailedWorkspaceInvitationSchema')