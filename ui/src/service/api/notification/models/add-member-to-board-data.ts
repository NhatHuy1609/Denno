import { z } from 'zod'

export const AddMemberToBoardDataSchema = z.object({
  boardId: z.string(),
  memberCreatorId: z.string(),
  addedMemberId: z.string()
})
