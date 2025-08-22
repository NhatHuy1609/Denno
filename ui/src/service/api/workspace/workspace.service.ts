import { httpPost, httpGet, httpPut, httpDel } from '../_req'
import { AxiosContracts } from '@/lib/axios/AxiosContracts'
import {
  AddWorkspaceMemberDto,
  CreateWorkspaceDto,
  CreateWorkspaceJoinRequestDto,
  DetailedWorkspaceInvitationSecretResponseDto,
  UpdateWorkspaceDto,
  UpdateWorkspaceLogoDto,
  UpdateWorkspaceMemberRoleDto,
  VerifyWorkspaceInvitationSecretRequestDto,
  WorkspaceInvitationSecretResponseDto,
  WorkspaceJoinRequestResponseDto,
  WorkspaceJoinRequestsResponseDto,
  WorkspaceResponseDto
} from './workspace.types'

import {
  AddWorkspaceMemberDtoSchema,
  CreateWorkspaceDtoSchema,
  CreateWorkspaceJoinRequestDtoSchema,
  UpdateWorkspaceDtoSchema,
  UpdateWorkspaceLogoDtoSchema,
  UpdateWorkspaceMemberRoleDtoSchema,
  VerifyWorkspaceInvitationSecretRequestDtoSchema
} from './workspace.contracts'

import { WorkspaceQueryParamsDto } from '../_models/query-models/workspace/workspace.types'
import { AddWorkspaceMemberActionResponseDto, JoinWorkspaceByLinkActionResponseDto } from '../action/action.types'

export class WorkspaceService {
  private static readonly basePath = '/workspaces'

  static workspaceQuery(workspaceId: string, config?: { signal?: AbortSignal; params?: WorkspaceQueryParamsDto }) {
    return httpGet<WorkspaceResponseDto>(`${this.basePath}/${workspaceId}`, config)
  }

  static CreateWorkspaceMutation(data: { createWorkspaceDto: CreateWorkspaceDto }) {
    const createWorkspaceDto = AxiosContracts.requestContract(CreateWorkspaceDtoSchema, data.createWorkspaceDto)

    return httpPost<WorkspaceResponseDto>(this.basePath, createWorkspaceDto)
  }

  static updateWorkspaceMutation(data: { workspaceId: string; updateWorkspaceDto: UpdateWorkspaceDto }) {
    const updateWorkspaceDto = AxiosContracts.requestContract(UpdateWorkspaceDtoSchema, data.updateWorkspaceDto)

    return httpPut(`${this.basePath}/${data.workspaceId}`, updateWorkspaceDto)
  }

  static updateWorkspaceLogoMutation(data: { workspaceId: string; updateWorkspaceLogoDto: UpdateWorkspaceLogoDto }) {
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

  static addWorkspaceMemberMutation(data: { workspaceId: string; addWorkspaceMemberDto: AddWorkspaceMemberDto }) {
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
    return httpGet<DetailedWorkspaceInvitationSecretResponseDto>(
      `${this.basePath}/${workspaceId}/invitationSecret/detailed`
    )
  }

  static createWorkspaceInvitationSecretMutation(workspaceId: string) {
    return httpPost<WorkspaceInvitationSecretResponseDto>(`${this.basePath}/${workspaceId}/invitationSecret`)
  }

  static verifyWorkspaceInvitationSecretMutation(
    workspaceId: string,
    data: { verifyInvitationSecretDto: VerifyWorkspaceInvitationSecretRequestDto }
  ) {
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
    return httpPost<JoinWorkspaceByLinkActionResponseDto>(`${this.basePath}/${workspaceId}/joinByLink`)
  }

  static workspaceJoinRequestsQuery(workspaceId: string) {
    return httpGet<WorkspaceJoinRequestsResponseDto>(`${this.basePath}/${workspaceId}/joinRequests`)
  }

  static createWorkspaceJoinRequestMutation(
    workspaceId: string,
    data: { createWorkspaceJoinRequestDto: CreateWorkspaceJoinRequestDto }
  ) {
    const createWorkspaceJoinRequestDto = AxiosContracts.requestContract(
      CreateWorkspaceJoinRequestDtoSchema,
      data.createWorkspaceJoinRequestDto
    )

    return httpPost<WorkspaceJoinRequestResponseDto>(
      `${this.basePath}/${workspaceId}/joinRequests`,
      createWorkspaceJoinRequestDto
    )
  }

  static approveWorkspaceJoinRequest(requestId: number) {
    return httpPost(`${this.basePath}/joinRequests/${requestId}/approval`)
  }

  static rejectWorkspaceJoinRequest(requestId: number) {
    return httpDel(`${this.basePath}/joinRequests//${requestId}/rejection`)
  }

  static updateWorkspaceMemberRole(
    workspaceId: string,
    memberId: string,
    data: { updateWorkspaceMemberRoleDto: UpdateWorkspaceMemberRoleDto }
  ) {
    const updateWorkspaceMemberRoleDto = AxiosContracts.requestContract(
      UpdateWorkspaceMemberRoleDtoSchema,
      data.updateWorkspaceMemberRoleDto
    )

    return httpPut(`${this.basePath}/${workspaceId}/members/${memberId}/role`, updateWorkspaceMemberRoleDto)
  }

  static removeWorkspaceMember(workspaceId: string, memberId: string) {
    return httpDel(`${this.basePath}/${workspaceId}/members/${memberId}`)
  }
}
