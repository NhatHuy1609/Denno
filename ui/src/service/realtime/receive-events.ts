import { notificationTypesDto } from "../api/notification"

// These types are used in the receive events client.

export type NotificationReceiveEvents = {
  'ReceiveActionNotification': (notificationResponse: notificationTypesDto.NotificationResponseDto) => void
}

export type WorkspaceReceiveEvents = {}

export type BoardReceiveEvents = {}

export type HubReceiveEventMap = {
  notification: NotificationReceiveEvents
  workspace: WorkspaceReceiveEvents
  board: BoardReceiveEvents
}