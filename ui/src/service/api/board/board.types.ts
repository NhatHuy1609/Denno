import { z } from 'zod'
import { 
  CreateBoardDtoSchema,
  BoardResponseDtoSchema,
  BoardsResponseDtoSchema,
  AddBoardMemberDtoSchema
} from './board.contracts'

export type CreateBoardDto = z.infer<typeof CreateBoardDtoSchema>
export type BoardResponseDto = z.infer<typeof BoardResponseDtoSchema>
export type BoardsResponseDto = z.infer<typeof BoardsResponseDtoSchema>
export type AddBoardMemberDto = z.infer<typeof AddBoardMemberDtoSchema>