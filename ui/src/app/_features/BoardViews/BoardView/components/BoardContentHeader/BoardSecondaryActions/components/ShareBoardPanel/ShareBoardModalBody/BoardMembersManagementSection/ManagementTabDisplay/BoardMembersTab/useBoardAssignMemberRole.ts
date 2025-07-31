import { useMemo } from "react"
import { boardTypes } from "@/entities/board"
import { useSyncedLocalStorage } from "@/app/_hooks/useSyncedLocalStorage"
import { PersistedStateKey } from "@/data/persisted-keys"
import { useBoardQuery, useWorkspaceQuery } from "@/app/_hooks/query"
import { BoardAssignMemberRolePolicyContext } from "@/permissions/policies/board/board-assign-member-role.policy"
import { useMe } from "@/app/_hooks/query/user/useMe"
import { PolicyEngine } from "@/permissions/core/policy-engine"

type UseBoardAssignMemberRoleProps = {
  targetMemberId: string
  targetMemberRole: boardTypes.BoardMemberRole
}

type UseBoardAssignMemberRoleResult = {
  canAssign: boolean
  canAssignReason: string
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
  }, [boardMembers, workspaceOwnerId, currentUser])

  if (!context) return {
    canAssign: false,
    canAssignReason: 'Context for policy check is null'
  }

  const assignResult = policyEngine.canWithReason(
    'board_assign_member_role',
    'board',
    context
  )

  return {
    canAssign: assignResult.allowed,
    canAssignReason: assignResult.reason?.message || ''
  }
}
