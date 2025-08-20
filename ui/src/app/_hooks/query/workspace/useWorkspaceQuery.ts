import { WorkspaceQueries } from '@/entities/workspace'
import type { workspaceSchemas } from '@/entities/workspace'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useWorkspaceQuery = (
  workspaceId: string,
  filter?: workspaceSchemas.WorkspaceFilterQuery,
  options?: ApiQueryOptionsParams<workspaceSchemas.Workspace>
) => {
  const queryOptions = WorkspaceQueries.workspaceQuery(workspaceId, filter)

  return useApiQueryWrapper(queryOptions, options)
}
