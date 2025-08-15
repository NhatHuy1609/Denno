import { WorkspaceQueries, workspaceSchemas } from '@/entities/workspace'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useJoinRequestsQuery = (
  workspaceId: string,
  options?: ApiQueryOptionsParams<workspaceSchemas.WorkspaceJoinRequests>
) => {
  const queryOptions = WorkspaceQueries.workspaceJoinRequestsQuery(workspaceId)

  return useApiQueryWrapper(queryOptions, options)
}
