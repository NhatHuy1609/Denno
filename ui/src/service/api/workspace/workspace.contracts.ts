import { z } from 'zod'
import { MemberRoleEnumSchema } from '../_enums/enums.contracts'
import { GetUserResponseDtoSchema } from '../user/user.contracts'

// Request
export const CreateWorkspaceDtoSchema = z.object({
  name: z.string(),
  description: z.string()
}).describe("CreateWorkspaceDtoSchema")

export const UpdateWorkspaceDtoSchema = z.object({
  name: z.string({ required_error: 'Name required!' }).min(1),
  description: z.string()
}).describe("UpdateWorkspaceDtoSchema")

export const UpdateWorkspaceLogoDtoSchema = z.object({
  logoFile: z.instanceof(Blob).optional().nullable()
}).describe("UpdateWorkspaceLogoDtoSchema")

export const AddWorkspaceMemberDtoSchema = z.object({
  email: z.string().email(),
  description: z.string().optional().default(""),
  role: MemberRoleEnumSchema.optional().default('Normal')
}).describe("AddWorkspaceMemberDtoSchema")

export const VerifyWorkspaceInvitationSecretRequestDtoSchema = z.object({
  secretCode: z.string()
}).describe("VerifyWorkspaceInvitationSecretRequestDtoSchema")

// Response
export const WorkspaceResponseDtoSchema = z.object({
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
    avatar: z.string(),
    fullName: z.string(),
    email: z.string(),
    memberType: z.enum(['Normal', 'Admin']),
  })).optional(),
}).describe('WorkspaceResponseDtoSchema')

export const WorkspacesResponseDtoSchema = z.array(WorkspaceResponseDtoSchema)
.describe('WorkspacesResponseDtoSchema')

export const AddWorkspaceMemberResponseDtoSchema = z.object({
  actionId: z.string().uuid(),
  date: z.string().datetime(),
  actionType: z.string(),
  workspaceId: z.string(),
  memberCreatorId: z.string(),
  targetUserId: z.string()
}).describe("AddWorkspaceMemberResponseDtoSchema")

export const WorkspaceInvitationSecretResponseDtoSchema = z.object({
  secretCode: z.string()
}).describe("WorkspaceInvitationSecretResponseDtoSchema")

export const DetailedWorkspaceInvitationResponseDtoSchema= z.object({
  inviter: GetUserResponseDtoSchema,
  workspace: WorkspaceResponseDtoSchema
}).describe('DetailedWorkspaceInvitationResponseDtoSchema')