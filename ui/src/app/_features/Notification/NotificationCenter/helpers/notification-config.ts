import type { Notification } from '@/entities/notification/notification.types'
import type { NotificationContentInfo, NotificationHeaderInfo } from './types'
import { formatDateTime } from '@/utils/formatDateTime'
import { getEntityIcon } from './entity-icons'
import { useRouter } from 'next/navigation'
import { NotifiableActionType } from '@/entities/action/action.schemas'

type NotificationConfigItem = {
  header: (notification: Notification) => NotificationHeaderInfo | null
  content: (
    notification: Notification,
    router: ReturnType<typeof useRouter>
  ) => Omit<NotificationContentInfo, 'initiator' | 'date'>
}

const notificationConfig: Record<NotifiableActionType, NotificationConfigItem> = {
  addMemberToWorkspace: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon(entities.workspace.type),
      entityName: entities.workspace.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Is now a member of the Workspace ' },
        {
          type: 'entity',
          entity: {
            id: entities.workspace.id,
            name: entities.workspace.text,
            url: `/workspace/${entities.workspace.id}/members`
          }
        },
        {
          type: 'text',
          content: '. Help them get started by adding them to a card in any board.'
        }
      ]
    })
  },

  joinWorkspaceByLink: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon(entities.workspace.type),
      entityName: entities.workspace.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Joined the Workspace via invite link: ' },
        {
          type: 'entity',
          entity: {
            id: entities.workspace.id,
            name: entities.workspace.text,
            url: `/workspace/${entities.workspace.id}/members`
          }
        }
      ]
    })
  },

  approveWorkspaceJoinRequest: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon(entities.workspace.type),
      entityName: entities.workspace.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'entity', entity: { id: entities.requester.id, name: entities.requester.text, url: '' } },
        { type: 'text', content: "'s request to join the Workspace " },
        {
          type: 'entity',
          entity: {
            id: entities.workspace.id,
            name: entities.workspace.text,
            url: `/workspace/${entities.workspace.id}/members`
          }
        },
        { type: 'text', content: ' has been approved.' }
      ]
    })
  },

  rejectWorkspaceJoinRequest: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon(entities.workspace.type),
      entityName: entities.workspace.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Your request to join the Workspace ' },
        {
          type: 'entity',
          entity: {
            id: entities.workspace.id,
            name: entities.workspace.text,
            url: `/workspace/${entities.workspace.id}/members`
          }
        },
        { type: 'text', content: ' has been rejected.' }
      ]
    })
  },

  sendWorkspaceJoinRequest: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon(entities.workspace.type),
      entityName: entities.workspace.text
    }),
    content: ({ entities }, router) => ({
      description: [
        { type: 'entity', entity: { id: entities.requester.id, name: entities.requester.text, url: '' } },
        { type: 'text', content: ' wants to join the Workspace ' },
        {
          type: 'entity',
          entity: {
            id: entities.workspace.id,
            name: entities.workspace.text,
            url: `/workspace/${entities.workspace.id}/members`
          }
        }
      ],
      actionButton: {
        text: 'Review pending requests',
        onClick: () => router.push(`/workspace/${entities.workspace.id}/members?tab=requests`)
      }
    })
  },

  // -------------------------------
  // Board related (fill placeholders)
  // -------------------------------
  addMemberToBoard: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon('board', entities.board.imageUrl),
      entityName: entities.board.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Added you' },
        { type: 'text', content: ' to the board ' },
        {
          type: 'entity',
          entity: { id: entities.board.id, name: entities.board.text, url: `/board/${entities.board.id}/members` }
        }
      ]
    })
  },

  joinBoardByLink: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon('board', entities.board.imageUrl),
      entityName: entities.board.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Can now see the board ' },
        {
          type: 'entity',
          entity: { id: entities.board.id, name: entities.board.text, url: `/board/${entities.board.id}` }
        },
        {
          type: 'text',
          content: ". Try adding them to a card so they'll know where to start."
        }
      ]
    })
  },

  sendBoardJoinRequest: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon('board', entities.board.imageUrl),
      entityName: entities.board.text
    }),
    content: ({ entities, metaData }, router) => {
      const { isWorkspaceMember } = metaData

      return {
        description: [
          { type: 'entity', entity: { id: entities.requester.id, name: entities.requester.text, url: '' } },
          { type: 'text', content: ' wants to join the board ' },
          {
            type: 'entity',
            entity: { id: entities.board.id, name: entities.board.text, url: `/board/${entities.board.id}/members` }
          },
          {
            type: 'text',
            content: isWorkspaceMember
              ? ". They are not a member of the board's Workspace "
              : ". They are already a member of the board's Workspace "
          },
          {
            type: 'entity',
            entity: {
              id: entities.workspace.id,
              name: entities.workspace.text,
              url: `/workspace/${entities.workspace.id}/members`
            }
          }
        ],
        actionButton: {
          text: 'Go to board',
          onClick: () => router.push(`/board/${entities.board.id}`)
        }
      }
    }
  },

  approveBoardJoinRequest: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon('board', entities.board.imageUrl),
      entityName: entities.board.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Your request to join the board ' },
        {
          type: 'entity',
          entity: { id: entities.board.id, name: entities.board.text, url: `/board/${entities.board.id}` }
        },
        { type: 'text', content: ' has been approved.' }
      ]
    })
  },

  rejectBoardJoinRequest: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon('board', entities.board.imageUrl),
      entityName: entities.board.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Your request to join the board ' },
        {
          type: 'entity',
          entity: { id: entities.board.id, name: entities.board.text, url: `/board/${entities.board.id}` }
        },
        { type: 'text', content: ' has been rejected.' }
      ]
    })
  },

  removeBoardMember: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon('board', entities.board.imageUrl),
      entityName: entities.board.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Removed you from the board ' },
        {
          type: 'entity',
          entity: { id: entities.board.id, name: entities.board.text, url: `/board/${entities.board.id}` }
        }
      ]
    })
  },

  updateWorkspaceMemberRole: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon('workspace'),
      entityName: entities.workspace.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Made you an admin of the Workspace ' },
        {
          type: 'entity',
          entity: {
            id: entities.workspace.id,
            name: entities.workspace.text,
            url: `/workspace/${entities.workspace.id}/members`
          }
        }
      ]
    })
  },

  removeWorkspaceMember: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon('workspace'),
      entityName: entities.workspace.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Removed you from the workspace ' },
        {
          type: 'entity',
          entity: {
            id: entities.workspace.id,
            name: entities.workspace.text,
            url: `/workspace/${entities.workspace.id}`
          }
        }
      ]
    })
  },

  removeWorkspaceGuest: {
    header: ({ entities }) => ({
      entityIcon: getEntityIcon('workspace'),
      entityName: entities.workspace.text
    }),
    content: ({ entities }) => ({
      description: [
        { type: 'text', content: 'Removed you as a guest from the workspace ' },
        {
          type: 'entity',
          entity: {
            id: entities.workspace.id,
            name: entities.workspace.text,
            url: `/workspace/${entities.workspace.id}`
          }
        }
      ]
    })
  }
}

export function useNotificationUI(notification: Notification): {
  header: NotificationHeaderInfo | null
  content: NotificationContentInfo
} {
  const router = useRouter()
  const config = notificationConfig[notification.type]

  if (!config) {
    console.error(`Unknown notification type: ${notification.type}`)
    return {
      header: null,
      content: {
        initiator: notification.initiator,
        description: [],
        date: formatDateTime(notification.date)
      }
    }
  }

  const header = config.header(notification)
  const { description, actionButton } = config.content(notification, router)

  return {
    header,
    content: {
      initiator: notification.initiator,
      description,
      actionButton,
      date: formatDateTime(notification.date)
    }
  }
}
