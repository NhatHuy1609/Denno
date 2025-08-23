import { notificationTypesDto } from '../api/notification'

export type BaseHubReceiveEvents = {
  Error: (message: string) => void
  Success: (message: string) => void
}

// These types are used in the receive events client of notification hub.
export type NotificationReceiveEvents = {
  ReceiveActionNotification: (notificationResponse: notificationTypesDto.NotificationResponseDto) => void
}
export type WorkspaceReceiveEvents = {
  OnWorkspaceMemberRoleChanged: () => void
  OnWorkspaceMemberRemoved: (
    removedUserId: string,
    actorUserId: string,
    workspaceId: string,
    removeRelatedAccessibleBoards: boolean
  ) => void
  OnWorkspaceMemberLeft: (userId: string, workspaceId: string) => void
}

export type BoardReceiveEvents = {
  ReceiveMemberRoleChanged: () => void
}

export type HubReceiveEventMap = {
  notification: NotificationReceiveEvents
  workspace: WorkspaceReceiveEvents
  board: BoardReceiveEvents
}
