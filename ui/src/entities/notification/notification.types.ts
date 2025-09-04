import { NotifiableActionType } from '../action/action.schemas'
import { EntityType } from '../metadata/metadata.schemas'

export type Notification = {
  id: number
  isRead: boolean
  type: NotifiableActionType
  date: string
  initiator: {
    id: string
    name: string
    avatar: string
  }
  entities: Record<
    EntityType,
    {
      id: string
      type: EntityType
      text: string
      imageUrl?: string
    }
  >
  metaData: Record<string, any>
}
