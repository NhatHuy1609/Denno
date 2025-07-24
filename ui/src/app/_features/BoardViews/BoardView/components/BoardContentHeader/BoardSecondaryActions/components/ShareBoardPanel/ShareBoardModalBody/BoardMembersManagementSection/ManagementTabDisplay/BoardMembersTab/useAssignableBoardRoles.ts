import { useMemo } from "react"
import { getAssignableBoardMemberRoles } from "./getAssignableBoardMemberRoles"
import { DropdownMenuPrimaryItemProps } from "@/app/_components/DropdownMenuPrimary"
import { boardTypes } from "@/entities/board"
import { useSyncedLocalStorage } from "@/app/_hooks/useSyncedLocalStorage"
import { PersistedStateKey } from "@/data/persisted-keys"
import { useBoardQuery, useWorkspaceQuery } from "@/app/_hooks/query"
import { BoardAssignMemberRolePolicyContext } from "@/permissions/policies/board/board-assign-member-role.policy"
import { useMe } from "@/app/_hooks/query/user/useMe"

type UseAssignableBoardRolesProps = {
  targetMemberId: string
}

export function useAssignableBoardRoles({
  targetMemberId,
}: UseAssignableBoardRolesProps): DropdownMenuPrimaryItemProps<boardTypes.BoardMemberRole>[] {
  const { data: currentUser } = useMe()
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')
  const { data: boardData } = useBoardQuery(boardId)
  const { data: workspaceData } = useWorkspaceQuery(workspaceId)

  const { members: boardMembers } = boardData || {}
  const workspaceOwnerId = workspaceData?.idOwner

  const context: BoardAssignMemberRolePolicyContext | null = useMemo(() => {
    if (!currentUser) return null

    return {
      user: currentUser,
      boardMembers: boardMembers ?? [],
      workspaceOwnerId: workspaceOwnerId || '',
    }
  }, [boardMembers, workspaceOwnerId, currentUser])


  const roles = useMemo(() => {
    return context ? getAssignableBoardMemberRoles(context, {
      targetMemberId,
    }) : []
  }, [context, targetMemberId])

  return roles
}