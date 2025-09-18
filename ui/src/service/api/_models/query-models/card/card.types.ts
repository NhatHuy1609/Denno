import { z } from 'zod'
import { CardQueryModelDtoSchema } from './card.contracts'

export type CardQueryModelDto = z.infer<typeof CardQueryModelDtoSchema>
