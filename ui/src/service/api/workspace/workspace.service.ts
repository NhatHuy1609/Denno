import { httpPost, httpGet, httpPut, httpDel } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import { 
  AddWorkspaceMemberDto, 
  CreateWorkspaceDto, 
  DetailedWorkspaceInvitationSecretResponseDto, 
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
} from './workspace.contracts'

import { WorkspaceQueryParamsDto } from '../_models/query-models/workspace/workspace.types'
import { AddWorkspaceMemberActionResponseDto, JoinWorkspaceByLinkActionResponseDto } from '../action/action.types'

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

    return httpPost<AddWorkspaceMemberActionResponseDto>(
      `${this.basePath}/${data.workspaceId}/members`,
      addWorkspaceMemberDto
    )
  }

  static workspaceInvitationSecretQuery(workspaceId: string) {
    return httpGet<WorkspaceInvitationSecretResponseDto>(`${this.basePath}/${workspaceId}/invitationSecret`)
  }

  static detailedWorkspaceInvitationSecretQuery(workspaceId: string) {
    return httpGet<DetailedWorkspaceInvitationSecretResponseDto>(`${this.basePath}/${workspaceId}/invitationSecret/detailed`)
  }

  static createWorkspaceInvitationSecretMutation(workspaceId: string) {
    return httpPost<WorkspaceInvitationSecretResponseDto>(`${this.basePath}/${workspaceId}/invitationSecret`)
  }

  static verifyWorkspaceInvitationSecretMutation(workspaceId: string, data: { verifyInvitationSecretDto: VerifyWorkspaceInvitationSecretRequestDto }) {
    const verifyInvitationSecretDto = AxiosContracts.requestContract(
      VerifyWorkspaceInvitationSecretRequestDtoSchema,
      data.verifyInvitationSecretDto
    )

    return httpPost(`${this.basePath}/${workspaceId}/invitationSecret/verification`, verifyInvitationSecretDto)
  }

  static disableWorkspaceInvitationSecretMutation(workspaceId: string) {
    return httpDel(`${this.basePath}/${workspaceId}/invitationSecret`)
  }

  static joinWorkspaceByLinkMutation(workspaceId: string) {
    return httpPost<JoinWorkspaceByLinkActionResponseDto>(
      `${this.basePath}/${workspaceId}/joinByLink`
    )
  }
}