import { z } from 'zod'

export const RejectBoardJoinRequestDataSchema = z.object({
  boardId: z.string(),
  requesterId: z.string(),
  memberCreatorId: z.string()
})
