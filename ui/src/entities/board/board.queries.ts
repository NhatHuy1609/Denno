import { BoardService } from '@/service/api/board'
import { queryOptions } from '@tanstack/react-query'
import {
  mapToBoardJoinRequests,
  mapToDetailedBoardInvitation,
  transformBoardDtoToBoard,
  transformBoardsDtoToBoards
} from './board.lib'
import { boardLib, boardSchemas } from '.'

export class BoardQueries {
  static readonly keys = {
    root: ['board'] as const,
    list: () => [...this.keys.root, 'boards', 'list'],
    detail: () => [...this.keys.root, 'detail']
  }

  static boardsByWorkspaceIdQuery(workspaceId: string) {
    return queryOptions({
      queryKey: [...this.keys.list(), `workspaceId-${workspaceId}`],
      queryFn: async ({ signal }) => {
        const response = await BoardService.boardsByWorkspaceIdQuery(workspaceId)
        return transformBoardsDtoToBoards(response.data)
      }
    })
  }

  static boardQuery(boardId: string, filter?: boardSchemas.BoardQueryFilter) {
    return queryOptions({
      queryKey: [...this.keys.detail(), filter, boardId] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await BoardService.boardQuery(boardId, {
          params: filter
        })
        return transformBoardDtoToBoard(response.data)
      }
    })
  }

  static boardInvitationSecretQuery(boardId: string) {
    return queryOptions({
      queryKey: [...this.keys.root, 'invitationSecret', boardId] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await BoardService.boardInvitationSecretQuery(boardId)
        return boardLib.mapToInvitationSecret(response.data)
      }
    })
  }

  static detailedBoardInvitationQuery(boardId: string) {
    return queryOptions({
      queryKey: [...this.keys.root, 'invitationSecret', boardId, 'detailed'] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await BoardService.detailedBoardInvitationSecretQuery(boardId)
        return mapToDetailedBoardInvitation(response.data)
      }
    })
  }

  static boardJoinRequestsQuery(boardId: string) {
    return queryOptions({
      queryKey: [...this.keys.root, 'joinRequests', `boardId=${boardId}`] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await BoardService.boardJoinRequestsQuery(boardId)
        return mapToBoardJoinRequests(response.data)
      }
    })
  }
}
