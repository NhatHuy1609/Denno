import { z } from 'zod'

export const RemoveWorkspaceGuestDataSchema = z.object({
  workspaceId: z.string(),
  memberCreatorId: z.string(),
  removedGuestId: z.string()
})
