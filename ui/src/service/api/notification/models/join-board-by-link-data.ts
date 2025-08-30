import { z } from 'zod'

export const JoinBoardByLinkDataSchema = z.object({
  boardId: z.string(),
  memberCreatorId: z.string()
})
