import { WorkspaceService } from '@/service/api/workspace'
import { queryOptions } from '@tanstack/react-query'
import { transformWorkspaceDtoToWorkspace, transformWorkspacesDtoToWorkspaces } from './workspace.lib'
import { WorkspaceFilterQuery } from './workspace.types'
import { WorkspaceQueryParamsDto } from '@/service/api/_models/query-models/workspace/workspace.types'

export class WorkspaceQueries {
  static readonly keys = {
    root: ['workspace'] as const,
    list: () => [...this.keys.root, 'workspaces', 'list']
  }

  static workspaceQuery(workspaceId: string, filter?: WorkspaceFilterQuery) {
    const params = {
      ...filter
    } as WorkspaceQueryParamsDto

    const config = {
      params
    }

    return queryOptions({
      queryKey: [...this.keys.root, workspaceId],
      queryFn: async ({ signal }) => {
        const response = await WorkspaceService.workspaceQuery(workspaceId, config)
        return transformWorkspaceDtoToWorkspace(response.data)
      }
    })
  }
}