import type { boardSchemas } from '@/entities/board'
import type { workspaceSchemas } from '@/entities/workspace'
import { BasePolicy } from '@/permissions/policies/base-policy'
import { PolicyContext } from '@/permissions/types/policy-context'
import { PolicyResult } from '@/permissions/types/policy-result'

export interface WorkspaceAssignMemberPermissionPolicyContext extends PolicyContext {
  targetRole: boardSchemas.BoardMemberRole
  targetMemberId: string
}

export interface WorkspaceAssignMemberPermissionPolicyResource {
  workspaceOwnerId: workspaceSchemas.Workspace['idOwner']
}
