// These types are used in the invoke events service.

export type NotificationInvokeEvents= {
  SendNotification: (notification: string) => void
}

export type HubInvokeEventMap = {
  notification: NotificationInvokeEvents
}
