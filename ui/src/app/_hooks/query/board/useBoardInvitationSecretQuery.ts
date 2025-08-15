import { BoardQueries } from '@/entities/board'
import { useApiQueryWrapper } from '../useApiQueryWrapper'
import { ApiQueryOptionsParams } from '../types'
import { InvitationSecret } from '@/entities/invitationSecret/invitationSecret.schemas'

export const useBoardInvitationSecretQuery = (boardId: string, options?: ApiQueryOptionsParams<InvitationSecret>) => {
  const queryOptions = BoardQueries.boardInvitationSecretQuery(boardId)

  return useApiQueryWrapper(queryOptions, options)
}
