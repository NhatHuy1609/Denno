import { WorkspaceQueries } from '@/entities/workspace'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'
import { DetailedWorkspaceInvitation } from '@/entities/workspace/workspace.schemas'

export const useDetailedWorkspaceInvitationQuery = (
  workspaceId: string,
  options?: ApiQueryOptionsParams<DetailedWorkspaceInvitation>
) => {
  const queryOptions = WorkspaceQueries.detailedWorkspaceInvitationQuery(workspaceId)

  return useApiQueryWrapper(queryOptions, options)
}
