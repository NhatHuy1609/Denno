import { WorkspaceQueries } from '@/entities/workspace'
import { useQuery } from '@tanstack/react-query'
import type { workspaceTypes } from '@/entities/workspace'
import { ApiQueryOptionsParams } from '../types'
import { useApiQueryWrapper } from '../useApiQueryWrapper'

export const useWorkspaceQuery = (
  workspaceId: string,
  filter?: workspaceTypes.WorkspaceFilterQuery,
  options?: ApiQueryOptionsParams<workspaceTypes.Workspace>
) => {
  const queryOptions = WorkspaceQueries.workspaceQuery(workspaceId, filter)

  return useApiQueryWrapper(queryOptions, options)
}
