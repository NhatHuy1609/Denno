import { httpPost, httpGet } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { CreateWorkspaceDto } from './workspace.types'
import { 
  CreateWorkspaceDtoSchema,
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

  static currentUserWorkspacesQuery(config: { signal?: AbortSignal }) {
    return httpGet('/users/me/workspaces')
            .then(AxiosContracts.responseContract(WorkspacesResponseDtoSchema))
  }

  static workspaceQuery(workspaceId: string) {
    return httpGet(`/workspaces/${workspaceId}`)
            .then(AxiosContracts.responseContract(WorkspaceResponseDtoSchema))
  }
}