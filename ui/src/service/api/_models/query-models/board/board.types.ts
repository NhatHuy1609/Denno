import { z }  from 'zod'
import { BoardQueryOptionsDto } from './board.contracts'

export type BoardQueryOptionsDto = z.infer<typeof BoardQueryOptionsDto>
