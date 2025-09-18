import { notificationTypesDto } from '../api/notification'
import type { cardListTypesDto } from '../api/cardList'
import { cardTypesDto } from '../api/card'

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
  OnBoardMemberRemoved: () => void
  OnCardListCreated: (newCreatedCardList: cardListTypesDto.CardListResponseDto) => void
  OnCardListUpdated: (newUpdatedCardList: cardListTypesDto.CardListResponseDto) => void
  OnCardCreated: (newCreatedCard: cardTypesDto.CardResponseDto) => void
  OnCardUpdated: (newUpdatedCard: cardTypesDto.CardResponseDto) => void
  OnCardRankUpdated: (
    oldCardListId: string,
    newCardListId: string | null,
    updatedCardResponse: cardTypesDto.CardResponseDto
  ) => void
  OnCardMemberAssigned: () => void
  OnCardMemberRemoved: () => void
}

export type HubReceiveEventMap = {
  notification: NotificationReceiveEvents
  workspace: WorkspaceReceiveEvents
  board: BoardReceiveEvents
}
