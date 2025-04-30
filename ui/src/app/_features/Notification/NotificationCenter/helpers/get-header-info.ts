import type { Notification } from "@/entities/notification/notification.types"
import type { NotificationHeaderInfo } from "./types"
import { getEntityIcon } from "./get-entity-icon"

export function getNotificationHeaderInfo(
  notification: Notification
): NotificationHeaderInfo | null {
  const { entities, type } = notification
  
  switch (type) {
    case "addMemberToWorkspace":
      return {
        entityIcon: getEntityIcon(entities.workspace.type),
        entityName: entities.workspace.text
      }
    case 'joinWorkspaceByLink': 
      return {
        entityIcon: getEntityIcon(entities.workspace.type),
        entityName: entities.workspace.text
      }
    case 'approveWorkspaceJoinRequest':
      return null
    case 'rejectWorkspaceJoinRequest':
      return null
    case 'sendWorkspaceJoinRequest':
      return {
        entityIcon: getEntityIcon(entities.workspace.type),
        entityName: entities.workspace.text
      }
    default:
      console.error("Invalid notification type")
      return null
  }
}
