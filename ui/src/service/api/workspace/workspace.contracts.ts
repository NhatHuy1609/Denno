import { z } from 'zod'
import { MemberRoleEnumSchema } from '../_enums/enums.contracts'

const WorkspaceDto = z.object({
  id: z.string(),
  name: z.string (),
  description: z.string(),
  visibility: z.string(),
  logoUrl: z.string().nullable(),
  ownerId: z.string(),
})

// Request
export const CreateWorkspaceDtoSchema = z.object({
  name: z
    .string({ required_error: 'Name required!' })
    .min(1, { message: 'Name required!' }),
  description: z
    .string({ required_error: 'Description required!' })
    .min(1, { message: 'Description required!' })
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

// Response
export const WorkspaceResponseDtoSchema = WorkspaceDto.describe("WorkspaceResponseDtoSchema")

export const WorkspacesResponseDtoSchema = z.array(WorkspaceDto).describe('WorkspacesResponseDtoSchema')

export const AddWorkspaceMemberResponseDtoSchema = z.object({
  actionId: z.string().uuid(),
  date: z.string().datetime(),
  actionType: z.string(),
  workspaceId: z.string(),
  memberCreatorId: z.string(),
  targetUserId: z.string()
}).describe("AddWorkspaceMemberResponseDtoSchema")