import { z } from 'zod'

export const EntityTypeSchema = z.enum([
  'user',
  'workspace',
  'board',
  'cardList',
  'card',
  'memberRole',
  'memberCreator',
  'addedMember',
  'joinedMember',
  'requester',
  'updatedMember',
  'removedMember',
  'removedGuest'
])

export type EntityType = z.infer<typeof EntityTypeSchema>
