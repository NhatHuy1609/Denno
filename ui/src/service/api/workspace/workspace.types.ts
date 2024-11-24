import { z } from 'zod'
import { 
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
// Response
export type WorkspaceResponseDto = z.infer<typeof WorkspaceResponseDtoSchema>
export type WorkspacesResponseDto = z.infer<typeof WorkspacesResponseDtoSchema>