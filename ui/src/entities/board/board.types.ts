import { z } from 'zod'
import { BoardSchema, BoardsSchema } from './board.contracts'

export type Board = z.infer<typeof BoardSchema>
export type Boards = z.infer<typeof BoardsSchema>