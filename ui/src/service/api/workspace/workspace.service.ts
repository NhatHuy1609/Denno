import { httpPost } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { CreateWorkspaceDto } from './workspace.types'
import { CreateWorkspaceDtoSchema } from './workspace.contracts'

export class WorkspaceService {
  static CreateWorkspaceMutation(data: { createWorkspaceDto: CreateWorkspaceDto }) {
    const createWorkspaceDto = AxiosContracts.requestContract(
      CreateWorkspaceDtoSchema,
      data.createWorkspaceDto)

    return httpPost('/workspace', createWorkspaceDto)
  }
}