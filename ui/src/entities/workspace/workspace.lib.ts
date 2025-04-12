import { workspaceTypesDto } from '@/service/api/workspace'
import { Workspace, Workspaces } from './workspace.types'
import { InvitationSecret } from '../invitationSecret/invitationSecret.types'

export function transformWorkspaceDtoToWorkspace(
  workspaceDto: workspaceTypesDto.WorkspaceResponseDto
): Workspace {
  return {
    ...workspaceDto
  }
}

export function transformWorkspacesDtoToWorkspaces(
  workspacesDto: workspaceTypesDto.WorkspacesResponseDto
): Workspaces {
  return workspacesDto.map(workspace => transformWorkspaceDtoToWorkspace(workspace))
}

export function mapToInvitationSecret(
  dto: workspaceTypesDto.WorkspaceInvitationSecretResponseDto
): InvitationSecret {
  return {
    ...dto
  };
}