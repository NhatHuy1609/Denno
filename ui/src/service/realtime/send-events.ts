// These types are used in the invoke events service.

export type NotificationInvokeEvents = {
  SendNotification: (notification: string) => void
}

export type BoardInvokeEvents = {
  JoinBoard: (boardId: string) => void
}

export type WorkspaceInvokeEvents = {
  JoinWorkspace: (workspaceId: string) => void
}

export type HubInvokeEventMap = {
  notification: NotificationInvokeEvents
  board: BoardInvokeEvents
  workspace: WorkspaceInvokeEvents
}
