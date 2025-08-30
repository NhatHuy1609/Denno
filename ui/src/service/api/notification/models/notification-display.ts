import { z } from 'zod'
import { EntityTypeSchema } from '../../_constants/entity-types'

const EntityTypeDisplaySchema = z.object({
  id: z.union([z.string(), z.string().uuid()]),
  type: EntityTypeSchema,
  text: z.string(),
  imageUrl: z.string().optional()
})

export const NotificationDisplaySchema = z.object({
  entities: z.record(z.string(), EntityTypeDisplaySchema)
})
