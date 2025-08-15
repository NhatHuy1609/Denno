import { BoardQueries } from '@/entities/board'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'
import { DetailedBoardInvitation } from '@/entities/board/board.schemas'

export const useDetailedBoardInvitationQuery = (
  boardId: string,
  options?: ApiQueryOptionsParams<DetailedBoardInvitation>
) => {
  const queryOptions = BoardQueries.detailedBoardInvitationQuery(boardId)

  return useApiQueryWrapper(queryOptions, options)
}
