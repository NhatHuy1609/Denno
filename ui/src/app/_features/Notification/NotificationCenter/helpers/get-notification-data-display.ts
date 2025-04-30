import type { Notification } from "@/entities/notification/notification.types"
import type { NotificationItemDisplay } from "./types"
import { getNotificationHeaderInfo } from "./get-header-info"
import { getContentInfo } from "./get-content-info"

export function getNotificationDataDisplay (
  notification: Notification
): NotificationItemDisplay {
  return {
    header: getNotificationHeaderInfo(notification),
    content: getContentInfo(notification)
  }
}