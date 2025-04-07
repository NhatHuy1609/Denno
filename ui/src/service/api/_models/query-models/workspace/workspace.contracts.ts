import { z }  from 'zod'

export const WorkspaceQuerySchema = z.object({
  fields: z.string().default(""),              // Default: all fields
  boardCounts: z.coerce.boolean().default(false), // Accepts "true"/"false" strings too
  members: z.coerce.boolean().default(false),
  member_fields: z.string().optional() // Optional string
});