import { WorkspaceService } from '@/service/api/workspace'
import { queryOptions } from '@tanstack/react-query'
import {
  mapToDetailedWorkspaceInvitation,
  mapToInvitationSecret,
  transformWorkspaceDtoToWorkspace,
  transformWorkspaceJoinRequestsDtoToWorkspaceJoinRequests
} from './workspace.lib'
import { WorkspaceQueryParamsDto } from '@/service/api/_models/query-models/workspace/workspace.types'
import { WorkspaceFilterQuery } from './workspace.schemas'

export class WorkspaceQueries {
  static readonly keys = {
    root: ['workspace'] as const,
    list: () => [...this.keys.root, 'workspaces', 'list']
  }

  static workspaceQuery(workspaceId: string, filter?: WorkspaceFilterQuery) {
    const params: WorkspaceQueryParamsDto = filter
      ? {
          ...filter
        }
      : {}

    return queryOptions({
      queryKey: [...this.keys.root, workspaceId, params] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await WorkspaceService.workspaceQuery(workspaceId, { params })
        return transformWorkspaceDtoToWorkspace(response.data)
      }
    })
  }

  static workspaceInvitationSecretQuery(workspaceId: string) {
    return queryOptions({
      queryKey: [...this.keys.root, 'invitationSecret', workspaceId] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await WorkspaceService.workspaceInvitationSecretQuery(workspaceId)
        return mapToInvitationSecret(response.data)
      }
    })
  }

  static detailedWorkspaceInvitationQuery(workspaceId: string) {
    return queryOptions({
      queryKey: [...this.keys.root, 'invitationSecret', workspaceId, 'detailed'] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await WorkspaceService.detailedWorkspaceInvitationSecretQuery(workspaceId)
        return mapToDetailedWorkspaceInvitation(response.data)
      }
    })
  }

  static workspaceJoinRequestsQuery(workspaceId: string) {
    return queryOptions({
      queryKey: [...this.keys.root, 'joinRequests', `workspaceId=${workspaceId}`] as unknown[],
      queryFn: async ({ signal }) => {
        const response = await WorkspaceService.workspaceJoinRequestsQuery(workspaceId)
        return transformWorkspaceJoinRequestsDtoToWorkspaceJoinRequests(response.data)
      }
    })
  }
}
