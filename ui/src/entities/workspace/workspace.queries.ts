import { WorkspaceService } from '@/service/api/workspace'
import { queryOptions } from '@tanstack/react-query'
import { transformWorkspaceDtoToWorkspace, transformWorkspacesDtoToWorkspaces } from './workspace.lib'

export class WorkspaceQueries {
  static readonly keys = {
    root: ['workspace'] as const,
    list: () => [...this.keys.root, 'workspaces', 'list']
  }

  static currentUserWorkspacesQuery() {
    return queryOptions({
      queryKey: [...this.keys.list(), 'me'],
      queryFn: async ({ signal }) => {
        const response = await WorkspaceService.currentUserWorkspacesQuery({ signal })
        return transformWorkspacesDtoToWorkspaces(response.data)
      }
    })
  }

  static workspaceQuery(workspaceId: string) {
    return queryOptions({
      queryKey: [...this.keys.root, workspaceId],
      queryFn: async ({ signal }) => {
        const response = await WorkspaceService.workspaceQuery(workspaceId)
        return transformWorkspaceDtoToWorkspace(response.data)
      }
    })
  }
}