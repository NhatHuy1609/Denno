import { z } from 'zod'

export const RemoveWorkspaceMemberDataSchema = z.object({
  workspaceId: z.string(),
  memberCreatorId: z.string(),
  removedMemberId: z.string()
})
