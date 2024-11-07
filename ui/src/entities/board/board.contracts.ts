import { z } from 'zod'
import { enumContracts } from '@/service/api/_enums'

export const BoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  background: z.string(),
  starredStatus: z.boolean(),
  workspaceId: z.string(),
  visibility: enumContracts.BoardVisibilityEnumSchema
})

export const BoardsSchema = z.array(BoardSchema)  