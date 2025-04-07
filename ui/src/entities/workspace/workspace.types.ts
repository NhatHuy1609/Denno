import { z } from 'zod'
import { 
  WorkspaceFilterQuerySchema,
  WorkspaceSchema,
  WorkspacesSchema
} from './workspace.contracts'

export type Workspace = z.infer<typeof WorkspaceSchema>
export type Workspaces = z.infer<typeof WorkspacesSchema>
export type WorkspaceFilterQuery = z.infer<typeof WorkspaceFilterQuerySchema>