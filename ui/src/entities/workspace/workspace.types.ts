import { z } from 'zod'
import { 
  DetailedWorkspaceInvitationSchema,
  WorkspaceFilterQuerySchema,
  WorkspaceJoinRequestSchema,
  WorkspaceJoinRequestsSchema,
  WorkspaceSchema,
  WorkspacesSchema
} from './workspace.contracts'

export type Workspace = z.infer<typeof WorkspaceSchema>
export type Workspaces = z.infer<typeof WorkspacesSchema>
export type WorkspaceFilterQuery = z.infer<typeof WorkspaceFilterQuerySchema>
export type DetailedWorkspaceInvitation = z.infer<typeof DetailedWorkspaceInvitationSchema>
export type WorkspaceJoinRequest = z.infer<typeof WorkspaceJoinRequestSchema>
export type WorkspaceJoinRequests = z.infer<typeof WorkspaceJoinRequestsSchema>