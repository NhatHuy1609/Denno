import { z } from 'zod'
import { CardSchema, CardsSchema } from './card.contracts'

export type Card = z.infer<typeof CardSchema>
export type Cards = z.infer<typeof CardsSchema>