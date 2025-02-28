import { z } from 'zod'
import { 
  WorkspaceSchema,
  WorkspacesSchema
} from './workspace.contracts'

export type Workspace = z.infer<typeof WorkspaceSchema>
export type Workspaces = z.infer<typeof WorkspacesSchema>