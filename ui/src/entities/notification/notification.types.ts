import { ActionType } from '@/service/api/_constants/action-types'
import { EntityType } from '@/service/api/_constants/entity-types'

export type Notification = {
  id: number
  isRead: boolean
  type: ActionType
  date: string
  translationKey: string
  initiator: {
    id: string
    name: string
    avatar: string
  }
  entities: Record<EntityType, {
    id: string
    type: EntityType
    text: string
  }>
}