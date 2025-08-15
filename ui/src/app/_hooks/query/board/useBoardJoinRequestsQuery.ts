import { BoardQueries, boardSchemas } from '@/entities/board'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useBoardJoinRequestsQuery = (
  boardId: string,
  options?: ApiQueryOptionsParams<boardSchemas.BoardJoinRequests>
) => {
  const queryOptions = BoardQueries.boardJoinRequestsQuery(boardId)

  return useApiQueryWrapper(queryOptions, options)
}
