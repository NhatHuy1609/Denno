import { useCallback, useMemo } from 'react'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { usePermissions } from '@/permissions/hooks/usePermissions'
import { PolicyAction } from '@/permissions/types/policy-actions'
import { PolicyResource } from '@/permissions/types/policy-resources'
import { PolicyContext } from '@/permissions/types/policy-context'
import { BoardLeavePolicyResource } from '@/permissions/policies/board/board-leave-policy'
import {
  BoardRemoveMemberPolicyContext,
  BoardRemoveMemberPolicyResource
} from '@/permissions/policies/board/board-remove-member.policy'
import { useBoardQuery, useWorkspaceQuery } from '@/app/_hooks/query'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/persisted-keys'

type MemberOtherActions = 'leaveBoard' | 'removeFromBoard'

type PolicyResourceData = Partial<BoardLeavePolicyResource | BoardRemoveMemberPolicyResource>
type PolicyContextData = PolicyContext | undefined

export const useBoardMemberOtherActions = (boardId: string, memberId: string) => {
  const { data: currentUser } = useMe()
  const { canWithReason } = usePermissions()

  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')

  // Lazy query for preparing needed policy context and related resource data
  const boardQuery = useBoardQuery(
    boardId,
    {
      includeBoardMembers: true
    },
    {
      enabled: false
    }
  )

  const workspaceQuery = useWorkspaceQuery(workspaceId, {}, { enabled: false })

  const isMemberCurrentUser = useMemo(() => currentUser?.id === memberId, [currentUser?.id, memberId])

  const availableActions = useMemo<MemberOtherActions[]>(
    () => (isMemberCurrentUser ? ['leaveBoard'] : ['removeFromBoard']),
    [isMemberCurrentUser]
  )

  // Memoized data fetcher that only fetches when needed
  const fetchRequiredData = useCallback(async () => {
    const [boardResult, workspaceResult] = await Promise.all([
      boardQuery.data ? Promise.resolve({ data: boardQuery.data }) : boardQuery.refetch(),
      workspaceQuery.data ? Promise.resolve({ data: workspaceQuery.data }) : workspaceQuery.refetch()
    ])

    if (!boardResult.data || !workspaceResult.data) {
      console.error('Failed to fetch required data for permission check', {
        boardData: !!boardResult.data,
        workspaceData: !!workspaceResult.data
      })
      return {
        boardMembers: [],
        workspaceOwnerId: ''
      }
    }

    return {
      boardMembers: boardResult.data.members,
      workspaceOwnerId: workspaceResult.data.idOwner
    }
  }, [boardQuery, workspaceQuery])

  // Action configuration with lazy data preparation
  const actionConfig = useMemo(
    () => ({
      leaveBoard: {
        action: 'board_leave' as PolicyAction,
        resource: 'board' as PolicyResource,
        label: 'Leave Board',
        prepare: async (): Promise<[PolicyResourceData, PolicyContextData]> => {
          const { boardMembers, workspaceOwnerId } = await fetchRequiredData()

          return [
            {
              workspaceOwnerId,
              boardMembers
            } as Partial<BoardLeavePolicyResource>,
            undefined
          ]
        }
      },
      removeFromBoard: {
        action: 'board_remove_member' as PolicyAction,
        resource: 'board' as PolicyResource,
        label: 'Remove from Board',
        prepare: async (): Promise<[PolicyResourceData, PolicyContextData]> => {
          const { boardMembers, workspaceOwnerId } = await fetchRequiredData()

          return [
            {
              workspaceOwnerId,
              boardMembers
            } as Partial<BoardRemoveMemberPolicyResource>,
            {
              targetMemberId: memberId
            } as BoardRemoveMemberPolicyContext
          ]
        }
      }
    }),
    [fetchRequiredData, memberId]
  )

  const getAvailableActions = useCallback(async () => {
    const promises = availableActions.map(async (action) => {
      try {
        const { action: policyAction, resource: policyResource, prepare, label } = actionConfig[action]
        const [resourceData, contextData] = await prepare()

        const result = canWithReason(policyAction, policyResource, resourceData, contextData)

        return {
          label,
          action,
          available: result.allowed,
          reason: result.reason?.message
        }
      } catch (error) {
        console.error(`Error checking permission for action ${action}:`, error)
        return {
          action,
          available: false,
          reason: error instanceof Error ? error.message : 'Permission check failed'
        }
      }
    })

    return await Promise.all(promises)
  }, [availableActions, actionConfig, canWithReason])

  return {
    getAvailableOtherMemberActions: getAvailableActions
  }
}
