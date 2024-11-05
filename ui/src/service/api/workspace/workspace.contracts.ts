import { z } from 'zod'

const WorkspaceDto = z.object({
  id: z.string(),
  name: z.string (),
  description: z.string(),
  visibility: z.string(),
  logoUrl: z.string(),
  ownerId: z.string(),
})

export const CreateWorkspaceDtoSchema = z.object({
  name: z
    .string({ required_error: 'Name required!' })
    .min(1, { message: 'Name required!' }),
  description: z
    .string({ required_error: 'Description required!' })
    .min(1, { message: 'Description required!' })
})

export const WorkspaceResponseDtoSchema = WorkspaceDto

export const WorkspacesResponseDtoSchema = z.array(WorkspaceDto)