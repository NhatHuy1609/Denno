import { workspaceTypesDto } from '@/service/api/workspace'
import {
  DetailedWorkspaceInvitation,
  Workspace,
  WorkspaceJoinRequest,
  WorkspaceJoinRequests,
  Workspaces
} from './workspace.schemas'
import { InvitationSecret } from '../invitationSecret/invitationSecret.schemas'

export function transformWorkspaceDtoToWorkspace(workspaceDto: workspaceTypesDto.WorkspaceResponseDto): Workspace {
  const { guests = [], members = [], joinRequests = [] } = workspaceDto

  return {
    ...workspaceDto,
    members,
    joinRequests,
    guests: guests?.map((guest) => ({
      user: {
        id: guest.user.id,
        fullName: guest.user.fullName,
        email: guest.user.email,
        avatar: guest.user.avatar
      },
      joinedBoards: guest.joinedBoards.map((board) => ({
        id: board.id,
        name: board.name,
        background: board.background
      }))
    }))
  }
}

export function transformWorkspacesDtoToWorkspaces(workspacesDto: workspaceTypesDto.WorkspacesResponseDto): Workspaces {
  return workspacesDto.map((workspace) => transformWorkspaceDtoToWorkspace(workspace))
}

export function mapToInvitationSecret(dto: workspaceTypesDto.WorkspaceInvitationSecretResponseDto): InvitationSecret {
  return {
    ...dto
  }
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

export function transformWorkspaceJoinRequestDtoToWorkspaceJoinRequest(
  dto: workspaceTypesDto.WorkspaceJoinRequestResponseDto
): WorkspaceJoinRequest {
  return {
    ...dto,
    requester: {
      ...dto.requester,
      name: dto.requester.name
    }
  }
}

export function transformWorkspaceJoinRequestsDtoToWorkspaceJoinRequests(
  dto: workspaceTypesDto.WorkspaceJoinRequestsResponseDto
): WorkspaceJoinRequests {
  return dto.map((workspaceJoinRequest) => transformWorkspaceJoinRequestDtoToWorkspaceJoinRequest(workspaceJoinRequest))
}
