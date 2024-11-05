import { workspaceTypesDto } from '@/service/api/workspace'
import { Workspace, Workspaces } from './workspace.types'

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