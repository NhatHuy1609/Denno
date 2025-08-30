import { z } from 'zod'

export const RemoveBoardMemberDataSchema = z.object({
  boardId: z.string(),
  memberCreatorId: z.string(),
  removedMemberId: z.string()
})
