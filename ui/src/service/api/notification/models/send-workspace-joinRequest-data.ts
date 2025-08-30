import { z } from 'zod'

export const SendWorkspaceJoinRequestDataSchema = z.object({
  workspaceId: z.string(),
  requesterId: z.string(),
  isWorkspaceMember: z.boolean()
})
