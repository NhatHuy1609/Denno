import type { Notification } from "@/entities/notification/notification.types"
import type { NotificationContentInfo } from "./types"
import { formatDateTime } from "@/utils/formatDateTime"

export function getContentInfo(
  notification: Notification
): NotificationContentInfo {
  const { initiator, entities, date: createdAt } = notification
  
  let description: NotificationContentInfo["description"] = []
  let actionButton: NotificationContentInfo["actionButton"] = undefined

  switch (notification.type) {
    case 'addMemberToWorkspace':
      description = [
        { type: "text", content: "Is now a member of the Workspace " },
        { type: 'entity', entity: { id: entities.workspace.id, name: entities.workspace.text, url: `/workspace/${entities.workspace.id}/members` } },
        { type: "text", content: ". Help them get started by adding them to a card in any board." },
      ]
      break
    case 'joinWorkspaceByLink':
      description = [
        { type: "text", content: "Is now a member of the Workspace " },
        { type: 'entity', entity: { id: entities.workspace.id, name: entities.workspace.text, url: `/workspace/${entities.workspace.id}/members` } },
        { type: "text", content: ". Help them get started by adding them to a card in any board." },
      ]
      break
    case 'approveWorkspaceJoinRequest':
      description = [
        { type: 'entity', entity: { id: entities.requester.id, name: entities.requester.text, url: `` } },
        { type: "text", content: "'s request to join the Workspace " },
        { type: 'entity', entity: { id: entities.workspace.id, name: entities.workspace.text, url: `/workspace/${entities.workspace.id}/members` } },
        { type: "text", content: " has been approved. Welcome them onboard!" },
      ]
      break
    case 'rejectWorkspaceJoinRequest':
      description = [
        { type: "text", content: "Your request to join the Workspace " },
        { type: 'entity', entity: { id: entities.workspace.id, name: entities.workspace.text, url: `/workspace/${entities.workspace.id}/members` } },
        { type: "text", content: " has been rejected." },
      ]
      break
    case 'sendWorkspaceJoinRequest':
      description = [
        { type: 'entity', entity: { id: entities.requester.id, name: entities.requester.text, url: `` } },
        { type: "text", content: " wants to join the Workspace " },
        { type: 'entity', entity: { id: entities.workspace.id, name: entities.workspace.text, url: `/workspace/${entities.workspace.id}/members` } },
      ]
      actionButton = {
        text: 'Review pending requests',
        onClick: () => {
          window.location.href = `/workspace/${entities.workspace.id}/members?tab=requests`
        }
      }
      break
    default:
      console.error(`Unknown notification type: ${notification.type}`)
      break
  }

  return {
    initiator,
    description,
    date: formatDateTime(createdAt)
  }
}