import { IconType } from "react-icons/lib"

export type NotificationHeaderInfo = {
  entityIcon: IconType
  entityName: string
}

// NotificationContentInfo type
type NotificationEntity = {
  id: string
  name: string
  url?: string
}

type NotificationTextPart =
  | { type: "text"; content: string }
  | { type: "entity"; entity: NotificationEntity }

type NotificationDescription = NotificationTextPart[]

export type NotificationContentInfo = {
  initiator: {
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