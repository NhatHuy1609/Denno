import { BoardQueries, boardSchemas } from '@/entities/board'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useBoardQuery = (
  boardId: string,
  filter?: boardSchemas.BoardQueryFilter,
  options?: ApiQueryOptionsParams<boardSchemas.Board>
) => {
  const queryOptions = BoardQueries.boardQuery(boardId, filter)

  return useApiQueryWrapper(queryOptions, options)
}
