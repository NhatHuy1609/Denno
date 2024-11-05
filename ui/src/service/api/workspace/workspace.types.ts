import { z } from 'zod'
import { 
  CreateWorkspaceDtoSchema,
  WorkspaceResponseDtoSchema ,
  WorkspacesResponseDtoSchema
} from './workspace.contracts'

export type CreateWorkspaceDto = z.infer<typeof CreateWorkspaceDtoSchema>
export type WorkspaceResponseDto = z.infer<typeof WorkspaceResponseDtoSchema>
export type WorkspacesResponseDto = z.infer<typeof WorkspacesResponseDtoSchema>