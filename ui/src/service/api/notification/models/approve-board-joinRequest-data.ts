import { z } from 'zod'

export const ApproveBoardJoinRequestDataSchema = z.object({
  boardId: z.string(),
  memberCreatorId: z.string(),
  addedMemberId: z.string()
})
