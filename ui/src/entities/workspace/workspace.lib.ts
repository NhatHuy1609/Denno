import { workspaceTypesDto } from '@/service/api/workspace'
import { DetailedWorkspaceInvitation, Workspace, Workspaces } from './workspace.types'
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

export function mapToDetailedWorkspaceInvitation(
  dto: workspaceTypesDto.DetailedWorkspaceInvitationSecretResponseDto
): DetailedWorkspaceInvitation {
  return {
    inviter: {
      id: dto.inviter.id,
      fullName: dto.inviter.fullName,
      email: dto.inviter.email
    },
    workspace: {
      id: dto.workspace.id,
      name: dto.workspace.name
    }
  }
}