import { useMemo } from 'react'
import { getAssignableBoardMemberRoles } from '../utils/getAssignableBoardMemberRoles'
import { DropdownMenuPrimaryItemProps } from '@/app/_components/DropdownMenuPrimary'
import { boardSchemas } from '@/entities/board'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useBoardQuery, useWorkspaceQuery } from '@/app/_hooks/query'
import { BoardAssignMemberRolePolicyContext } from '@/permissions/policies/board/board-assign-member-role.policy'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { PolicyContext } from '@/permissions/types/policy-context'

type UseAssignableBoardRolesProps = {
  targetMemberId: string
}

type UseAssignableBoardRolesResult = {
  roles: DropdownMenuPrimaryItemProps<boardSchemas.BoardMemberRole>[]
  currentUserBoardMemberRole: boardSchemas.BoardMemberRole
}

// This hook is used for getting dynamic assignable board member roles
// with context is the assigner is current logged in user and assignee is the target member
export function useAssignableBoardRoles({
  targetMemberId
}: UseAssignableBoardRolesProps): UseAssignableBoardRolesResult {
  const { data: currentUser } = useMe()
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')
  const { data: boardData } = useBoardQuery(boardId, {
    includeBoardMembers: true
  })
  const { data: workspaceData } = useWorkspaceQuery(workspaceId)

  const { members: boardMembers } = boardData || {}
  const workspaceOwnerId = workspaceData?.idOwner

  const context: (Omit<BoardAssignMemberRolePolicyContext, 'targetRole'> & PolicyContext) | null = useMemo(() => {
    if (!currentUser) return null

    return {
      user: currentUser,
      targetMemberId
    }
  }, [boardMembers, workspaceOwnerId, currentUser])

  const roles = useMemo(() => {
    return context
      ? getAssignableBoardMemberRoles(context, {
          boardMembers: boardMembers ?? [],
          workspaceOwnerId: workspaceOwnerId || ''
        })
      : []
  }, [context, targetMemberId])

  const currentUserBoardMemberRole = useMemo(() => {
    if (!currentUser || !boardMembers) return 'Observer'
    return boardMembers.find((member) => member.memberId === currentUser.id)?.boardMemberRole || 'Observer'
  }, [boardMembers, currentUser])

  return {
    roles,
    currentUserBoardMemberRole
  }
}
