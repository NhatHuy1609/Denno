import { z } from 'zod'
import { 
  AddWorkspaceMemberDtoSchema,
  AddWorkspaceMemberResponseDtoSchema,
  CreateWorkspaceDtoSchema,
  UpdateWorkspaceDtoSchema,
  UpdateWorkspaceLogoDtoSchema,
  WorkspaceResponseDtoSchema ,
  WorkspacesResponseDtoSchema
} from './workspace.contracts'

// Request
export type CreateWorkspaceDto = z.infer<typeof CreateWorkspaceDtoSchema>
export type UpdateWorkspaceDto = z.infer<typeof UpdateWorkspaceDtoSchema>
export type UpdateWorkspaceLogoDto = z.infer<typeof UpdateWorkspaceLogoDtoSchema>
export type AddWorkspaceMemberDto = z.infer<typeof AddWorkspaceMemberDtoSchema>
// Response
export type WorkspaceResponseDto = z.infer<typeof WorkspaceResponseDtoSchema>
export type WorkspacesResponseDto = z.infer<typeof WorkspacesResponseDtoSchema>
export type AddWorkspaceMemberResponseDto = z.infer<typeof AddWorkspaceMemberResponseDtoSchema>