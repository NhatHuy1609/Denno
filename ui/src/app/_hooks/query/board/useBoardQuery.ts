import { BoardQueries, boardTypes } from '@/entities/board'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useBoardQuery = (
  boardId: string,
  filter?: boardTypes.BoardQueryFilter,
  options?: ApiQueryOptionsParams<boardTypes.Board>
) => {
  const queryOptions = BoardQueries.boardQuery(boardId, filter)

  return useApiQueryWrapper(queryOptions, options)
}
