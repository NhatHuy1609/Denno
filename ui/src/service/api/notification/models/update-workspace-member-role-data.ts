import { z } from 'zod'

export const UpdateWorkspaceMemberRoleDataSchema = z.object({
  workspaceId: z.string(),
  memberCreatorId: z.string(),
  updatedMemberId: z.string(),
  newMemberRole: z.string()
})
