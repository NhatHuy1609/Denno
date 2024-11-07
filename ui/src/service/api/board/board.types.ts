import { z } from 'zod'
import { 
  CreateBoardDtoSchema,
  BoardResponseDtoSchema,
  BoardsResponseDtoSchema
} from './board.contracts'

export type CreateBoardDto = z.infer<typeof CreateBoardDtoSchema>
export type BoardResponseDto = z.infer<typeof BoardResponseDtoSchema>
export type BoardsResponseDto = z.infer<typeof BoardsResponseDtoSchema>