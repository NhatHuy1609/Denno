import { httpPost, httpGet, httpPut, httpDel } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { 
  AddWorkspaceMemberDto, 
  AddWorkspaceMemberResponseDto, 
  CreateWorkspaceDto, 
  UpdateWorkspaceDto, 
  UpdateWorkspaceLogoDto, 
  VerifyWorkspaceInvitationSecretRequestDto, 
  WorkspaceInvitationSecretResponseDto, 
  WorkspaceResponseDto 
} from './workspace.types'

import { 
  AddWorkspaceMemberDtoSchema,
  CreateWorkspaceDtoSchema,
  UpdateWorkspaceDtoSchema,
  UpdateWorkspaceLogoDtoSchema,
  VerifyWorkspaceInvitationSecretRequestDtoSchema,
  WorkspaceResponseDtoSchema,
  WorkspacesResponseDtoSchema,
} from './workspace.contracts'

import { WorkspaceQueryParamsDto } from '../_models/query-models/workspace/workspace.types'

export class WorkspaceService {
  private static readonly basePath = '/workspaces'

  static workspaceQuery(workspaceId: string, config?: { signal?: AbortSignal, params?: WorkspaceQueryParamsDto }) {
    return httpGet<WorkspaceResponseDto>(`${this.basePath}/${workspaceId}`, config)
  }

  static CreateWorkspaceMutation(data: { createWorkspaceDto: CreateWorkspaceDto }) {
    const createWorkspaceDto = AxiosContracts.requestContract(
      CreateWorkspaceDtoSchema,
      data.createWorkspaceDto)

    return httpPost<WorkspaceResponseDto>(this.basePath, createWorkspaceDto)
  }

  static updateWorkspaceMutation(data: { workspaceId: string, updateWorkspaceDto: UpdateWorkspaceDto }) {
    const updateWorkspaceDto = AxiosContracts.requestContract(
      UpdateWorkspaceDtoSchema,
      data.updateWorkspaceDto
    )

    return httpPut(`${this.basePath}/${data.workspaceId}`, updateWorkspaceDto)
  }

  static updateWorkspaceLogoMutation(data: { workspaceId: string, updateWorkspaceLogoDto: UpdateWorkspaceLogoDto }) {
    const updateWorkspaceLogoDto = AxiosContracts.requestContract(
      UpdateWorkspaceLogoDtoSchema,
      data.updateWorkspaceLogoDto
    )

    return httpPut(`${this.basePath}/${data.workspaceId}/logo`, updateWorkspaceLogoDto, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  static addWorkspaceMemberMutation(data: { workspaceId: string, addWorkspaceMemberDto: AddWorkspaceMemberDto }) {
    const addWorkspaceMemberDto = AxiosContracts.requestContract(
      AddWorkspaceMemberDtoSchema,
      data.addWorkspaceMemberDto
    )

    return httpPost<AddWorkspaceMemberResponseDto>(`${this.basePath}/${data.workspaceId}/members`, addWorkspaceMemberDto)
  }

  static workspaceInvitationSecretQuery(workspaceId: string) {
    return httpGet<WorkspaceInvitationSecretResponseDto>(`${this.basePath}/${workspaceId}/invitationSecret`)
  }

  static createWorkspaceInvitationSecretMutation(workspaceId: string) {
    return httpPost<WorkspaceInvitationSecretResponseDto>(`${this.basePath}/${workspaceId}/invitationSecret`)
  }

  static disableWorkspaceInvitationSecretMutation(workspaceId: string) {
    return httpDel(`${this.basePath}/${workspaceId}/invitationSecret`)
  }

  static verifyInvitationSecretMutation(data: { workspaceId: string, verifyInvitationSecretDto: VerifyWorkspaceInvitationSecretRequestDto }) {
    const verifyInvitationSecretDto = AxiosContracts.requestContract(
      VerifyWorkspaceInvitationSecretRequestDtoSchema,
      data.verifyInvitationSecretDto
    )

    return httpPost(
      `${this.basePath}/${data.workspaceId}/invitationSecret/verify`,
      verifyInvitationSecretDto
    )
  }
}