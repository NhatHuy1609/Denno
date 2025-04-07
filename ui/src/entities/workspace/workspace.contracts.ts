import { z } from 'zod'

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
    Id: z.string(),
    Avatar: z.string(),
    FullName: z.string(),
    MemberType: z.enum(['Normal', 'Admin']),
  })).optional(),
}).describe('WorkspaceResponseDtoSchema')

export const WorkspacesSchema = z.array(WorkspaceSchema)

export const WorkspaceFilterQuerySchema = z.object({
  fields: z.string().default(""),
  boardCounts: z.coerce.boolean().default(false),
  members: z.coerce.boolean().default(false),
  memberFields: z.string().optional()
});