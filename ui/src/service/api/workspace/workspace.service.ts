import { httpPost, httpGet, httpPut } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { CreateWorkspaceDto, UpdateWorkspaceDto, UpdateWorkspaceLogoDto } from './workspace.types'
import { 
  CreateWorkspaceDtoSchema,
  UpdateWorkspaceDtoSchema,
  UpdateWorkspaceLogoDtoSchema,
  WorkspaceResponseDtoSchema,
  WorkspacesResponseDtoSchema 
} from './workspace.contracts'

export class WorkspaceService {
  static CreateWorkspaceMutation(data: { createWorkspaceDto: CreateWorkspaceDto }) {
    const createWorkspaceDto = AxiosContracts.requestContract(
      CreateWorkspaceDtoSchema,
      data.createWorkspaceDto)

    return httpPost('/workspaces', createWorkspaceDto)
  }

  static updateWorkspaceMutation(data: { workspaceId: string, updateWorkspaceDto: UpdateWorkspaceDto }) {
    const updateWorkspaceDto = AxiosContracts.requestContract(
      UpdateWorkspaceDtoSchema,
      data.updateWorkspaceDto
    )

    return httpPut(`/workspaces/${data.workspaceId}`, updateWorkspaceDto)
  }

  static updateWorkspaceLogoMutation(data: {workspaceId: string, updateWorkspaceLogoDto: UpdateWorkspaceLogoDto}) {
    const updateWorkspaceLogoDto = AxiosContracts.requestContract(
      UpdateWorkspaceLogoDtoSchema,
      data.updateWorkspaceLogoDto
    )

    return httpPut(`/workspaces/${data.workspaceId}/logo`, updateWorkspaceLogoDto, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  static currentUserWorkspacesQuery(config: { signal?: AbortSignal }) {
    return httpGet('/users/me/workspaces')
            .then(AxiosContracts.responseContract(WorkspacesResponseDtoSchema))
  }

  static workspaceQuery(workspaceId: string) {
    return httpGet(`/workspaces/${workspaceId}`)
            .then(AxiosContracts.responseContract(WorkspaceResponseDtoSchema))
  }
}