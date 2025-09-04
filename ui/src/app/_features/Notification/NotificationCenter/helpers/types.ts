import { ReactNode } from 'react'

export type NotificationHeaderInfo = {
  entityIcon: ReactNode
  entityName: string
}

// NotificationContentInfo type
type NotificationEntity = {
  id: string
  name: string
  url?: string
  imageUrl?: string
}

type NotificationTextPart =
  | {
      type: 'text'
      content: string
    }
  | {
      type: 'entity'
      entity: NotificationEntity
    }

type NotificationDescription = NotificationTextPart[]

export type NotificationContentInfo = {
  initiator: {
    id: string
    name: string
    avatar: string
  }
  date: string
  description: NotificationDescription
  actionButton?: {
    text: string
    onClick: () => void
  }
}

// NotificationItemDisplay type
export type NotificationItemDisplay = {
  header: NotificationHeaderInfo | null
  content: NotificationContentInfo
}
