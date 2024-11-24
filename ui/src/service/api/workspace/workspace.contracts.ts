import { z } from 'zod'

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

// Response
export const WorkspaceResponseDtoSchema = WorkspaceDto.describe("WorkspaceResponseDtoSchema")

export const WorkspacesResponseDtoSchema = z.array(WorkspaceDto).describe('WorkspacesResponseDtoSchema')