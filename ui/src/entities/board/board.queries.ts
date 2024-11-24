import { BoardService } from '@/service/api/board';
import { queryOptions } from '@tanstack/react-query';
import { transformBoardDtoToBoard, transformBoardsDtoToBoards } from './board.lib';

export class BoardQueries {
  static readonly keys = {
    root: ['board'] as const,
    list: () => [...this.keys.root, 'boards', 'list'],
    detail: () => [...this.keys.root, 'detail']
  }

  static boardsByWorkspaceIdQuery(workspaceId: string)  {
    return queryOptions({
      queryKey: [...this.keys.list(), `workspaceId-${workspaceId}`],
      queryFn: async ({ signal }) => {
        const response = await BoardService.boardsByWorkspaceIdQuery(workspaceId)
        return transformBoardsDtoToBoards(response.data)
      }
    })
  }

  static boardQuery(boardId: string) {
    return queryOptions({
      queryKey: [...this.keys.detail(), boardId],
      queryFn: async({signal}) => {
        const response = await BoardService.boardQuery(boardId)
        return transformBoardDtoToBoard(response.data)  
      }
    })
  }
}