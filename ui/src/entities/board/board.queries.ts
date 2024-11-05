import { BoardService } from '@/service/api/board';
import { queryOptions } from '@tanstack/react-query';
import { transformBoardsDtoToBoards } from './board.lib';

export class BoardQueries {
  static readonly keys = {
    root: ['board'] as const,
    list: () => [...this.keys.root, 'boards', 'list']
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
}