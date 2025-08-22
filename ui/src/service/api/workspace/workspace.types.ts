import { z } from 'zod'
import {
  AddWorkspaceMemberDtoSchema,
  AddWorkspaceMemberResponseDtoSchema,
  CreateWorkspaceDtoSchema,
  CreateWorkspaceJoinRequestDtoSchema,
  DetailedWorkspaceInvitationResponseDtoSchema,
  UpdateWorkspaceDtoSchema,
  UpdateWorkspaceLogoDtoSchema,
  UpdateWorkspaceMemberRoleDtoSchema,
  VerifyWorkspaceInvitationSecretRequestDtoSchema,
  WorkspaceGuestResponseDtoSchema,
  WorkspaceInvitationSecretResponseDtoSchema,
  WorkspaceJoinRequestResponseDtoSchema,
  WorkspaceJoinRequestsResponseDtoSchema,
  WorkspaceResponseDtoSchema,
  WorkspacesResponseDtoSchema
} from './workspace.contracts'

// Request
export type CreateWorkspaceDto = z.infer<typeof CreateWorkspaceDtoSchema>
export type UpdateWorkspaceDto = z.infer<typeof UpdateWorkspaceDtoSchema>
export type UpdateWorkspaceLogoDto = z.infer<typeof UpdateWorkspaceLogoDtoSchema>
export type AddWorkspaceMemberDto = z.infer<typeof AddWorkspaceMemberDtoSchema>
export type VerifyWorkspaceInvitationSecretRequestDto = z.infer<typeof VerifyWorkspaceInvitationSecretRequestDtoSchema>
export type CreateWorkspaceJoinRequestDto = z.infer<typeof CreateWorkspaceJoinRequestDtoSchema>
export type UpdateWorkspaceMemberRoleDto = z.infer<typeof UpdateWorkspaceMemberRoleDtoSchema>
// Response
export type WorkspaceResponseDto = z.infer<typeof WorkspaceResponseDtoSchema>
export type WorkspacesResponseDto = z.infer<typeof WorkspacesResponseDtoSchema>
export type AddWorkspaceMemberResponseDto = z.infer<typeof AddWorkspaceMemberResponseDtoSchema>
export type WorkspaceInvitationSecretResponseDto = z.infer<typeof WorkspaceInvitationSecretResponseDtoSchema>
export type DetailedWorkspaceInvitationSecretResponseDto = z.infer<typeof DetailedWorkspaceInvitationResponseDtoSchema>
export type WorkspaceJoinRequestResponseDto = z.infer<typeof WorkspaceJoinRequestResponseDtoSchema>
export type WorkspaceJoinRequestsResponseDto = z.infer<typeof WorkspaceJoinRequestsResponseDtoSchema>
export type WorkspaceGuestResponseDto = z.infer<typeof WorkspaceGuestResponseDtoSchema>
