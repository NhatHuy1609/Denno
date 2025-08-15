import { WorkspaceQueries } from '@/entities/workspace'
import { useApiQueryWrapper } from '../useApiQueryWrapper'
import { ApiQueryOptionsParams } from '../types'
import { InvitationSecret } from '@/entities/invitationSecret/invitationSecret.schemas'

export const useInvitationSecretQuery = (workspaceId: string, options?: ApiQueryOptionsParams<InvitationSecret>) => {
  const queryOptions = WorkspaceQueries.workspaceInvitationSecretQuery(workspaceId)

  return useApiQueryWrapper(queryOptions, options)
}
