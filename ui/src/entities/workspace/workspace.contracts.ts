import { z } from 'zod'

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string (),
  description: z.string(),
  visibility: z.string(),
  logoUrl: z.string().nullable(),
  ownerId: z.string(),
})

export const WorkspacesSchema = z.array(WorkspaceSchema)