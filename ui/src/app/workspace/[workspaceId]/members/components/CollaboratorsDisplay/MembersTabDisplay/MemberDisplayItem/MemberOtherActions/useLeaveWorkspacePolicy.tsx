import { useWorkspaceQuery } from '@/app/_hooks/query'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { usePermissions } from '@/permissions/hooks/usePermissions'
import {
  WorkspaceLeavePolicyContext,
  WorkspaceLeavePolicyResource
} from '@/permissions/policies/workspace/workspace-leave.policy'
import { PolicyResult } from '@/permissions/types/policy-result'
import { useCallback, useState } from 'react'

// Hook for preparing the evaluate function used to check the leave workspace policy
export const useLeaveWorkspacePolicy = (workspaceId: string) => {
  const [isEvaluating, setIsEvaluating] = useState(false)
  const { canWithReason } = usePermissions()
  const { data: currentUser } = useMe()
  const { data: workspaceData } = useWorkspaceQuery(workspaceId, {
    members: true
  })

  const evaluateLeaveWorkspacePolicy = useCallback(() => {
    // More thorough validation
    if (!currentUser) {
      return {
        allowed: false,
        reason: { message: 'User not authenticated' }
      } as PolicyResult
    }

    if (!workspaceData) {
      return {
        allowed: false,
        reason: { message: 'Workspace data not loaded' }
      } as PolicyResult
    }

    const { members, idOwner } = workspaceData

    if (!members || !Array.isArray(members) || members.length === 0) {
      return {
        allowed: false,
        reason: { message: 'Invalid workspace members data' }
      } as PolicyResult
    }

    if (!idOwner) {
      return {
        allowed: false,
        reason: { message: 'Workspace owner not found' }
      } as PolicyResult
    }

    const workspaceLeaveContext: WorkspaceLeavePolicyContext = {
      user: currentUser
    }

    const workspaceLeavePolicyResource: WorkspaceLeavePolicyResource = {
      workspaceMembers: members,
      workspaceOwnerId: idOwner
    }

    setIsEvaluating(true)

    const canLeaveWorkspace = canWithReason(
      'workspace_leave',
      'workspace',
      workspaceLeavePolicyResource,
      workspaceLeaveContext
    )

    setIsEvaluating(false)

    return canLeaveWorkspace
  }, [canWithReason, currentUser, workspaceData])

  return {
    evaluateLeaveWorkspacePolicy,
    isEvaluating
  }
}
