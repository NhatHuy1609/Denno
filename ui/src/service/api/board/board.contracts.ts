import { z } from 'zod'
import { enumContracts } from '../_enums'

const BoardDto = z.object({
  id: z.string(),
  name: z.string(),
  background: z.string(),
  starredStatus: z.boolean(),
  workspaceId: z.string(),
  visibility: enumContracts.BoardVisibilityEnumSchema
})

// Request
export const CreateBoardDtoSchema = z.object({
  name: z.string().min(1),
  workspaceId: z.string(),
  background: z.string(),
  visibility: z.string()
}).describe("CreateBoardDtoSchema")

// Response
export const BoardResponseDtoSchema = BoardDto.describe("BoardResponseDtoSchema")

export const BoardsResponseDtoSchema = z.array(BoardDto).describe("BoardsResponseDtoSchema")
