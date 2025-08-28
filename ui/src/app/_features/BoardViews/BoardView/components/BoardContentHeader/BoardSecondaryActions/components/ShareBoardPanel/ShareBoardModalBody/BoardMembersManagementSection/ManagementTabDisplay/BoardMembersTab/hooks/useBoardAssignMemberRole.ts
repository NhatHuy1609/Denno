import { useMemo } from 'react'
import { PolicyEngine } from '@/permissions/core/policy-engine'
import type { userSchemas } from '@/entities/user'
import type { boardSchemas } from '@/entities/board'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { useBoardQuery, useWorkspaceQuery } from '@/app/_hooks/query'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import {
  BoardAssignMemberRolePolicyContext,
  BoardAssignMemberRolePolicyResource
} from '@/permissions/policies/board/board-assign-member-role.policy'

type UseBoardAssignMemberRoleProps = {
  targetMemberId: string
  targetMemberRole: boardSchemas.BoardMemberRole
}

type UseBoardAssignMemberRoleResult = {
  canAssign: boolean
  canAssignReason: string
  workspaceOwnerId?: string
  currentAssigner?: userSchemas.User
}

// This hook is used for checking whether the current user can assign a role to a board member
// with context is the assigner is current logged in user and assignee is the target member
export function useBoardAssignMemberRole({
  targetMemberId,
  targetMemberRole
}: UseBoardAssignMemberRoleProps): UseBoardAssignMemberRoleResult {
  const { data: currentUser } = useMe()
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')
  const { data: boardData } = useBoardQuery(boardId, {
    includeBoardMembers: true
  })
  const { data: workspaceData } = useWorkspaceQuery(workspaceId)

  const { members: boardMembers } = boardData || {}
  const workspaceOwnerId = workspaceData?.idOwner

  // Initialize policy engine for policy check
  const policyEngine = new PolicyEngine()

  // Prepare context for policy check
  const context: BoardAssignMemberRolePolicyContext | null = useMemo(() => {
    if (!currentUser) return null

    return {
      user: currentUser,
      targetMemberId,
      targetRole: targetMemberRole
    }
  }, [currentUser, targetMemberId, targetMemberRole])

  const resourceData: BoardAssignMemberRolePolicyResource | null = useMemo(() => {
    if (!boardMembers || !workspaceOwnerId) return null

    return {
      boardMembers,
      workspaceOwnerId: workspaceOwnerId
    }
  }, [boardMembers, workspaceOwnerId])

  if (!context || !resourceData)
    return {
      canAssign: false,
      canAssignReason: 'Context or resource data for policy check is null'
    }

  const assignResult = policyEngine.canWithReason('board_assign_member_role', 'board', context, resourceData)

  return {
    canAssign: assignResult.allowed,
    canAssignReason: assignResult.reason?.message || '',
    workspaceOwnerId: workspaceOwnerId || '',
    currentAssigner: currentUser
  }
}
