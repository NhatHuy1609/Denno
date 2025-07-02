import { z }  from 'zod'

export const WorkspaceQuerySchema = z.object({
  fields: z.string().default("").optional(),
  boardCounts: z.coerce.boolean().default(false).optional(),
  members: z.coerce.boolean().default(false).optional(),
  joinRequests: z.coerce.boolean().default(false).optional(),
  member_fields: z.string().optional().optional()
});