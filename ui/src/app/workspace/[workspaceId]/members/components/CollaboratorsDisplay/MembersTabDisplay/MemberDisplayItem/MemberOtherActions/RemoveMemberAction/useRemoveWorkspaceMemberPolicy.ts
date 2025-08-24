import { useWorkspaceQuery } from '@/app/_hooks/query'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { usePermissions } from '@/permissions/hooks/usePermissions'
import {
  WorkspaceRemoveMemberPolicyContext,
  WorkspaceRemoveMemberPolicyResource
} from '@/permissions/policies/workspace/workspace-remove-member.policy'
import { PolicyResult } from '@/permissions/types/policy-result'
import { current } from '@reduxjs/toolkit'
import { useMemberDisplayItemContext } from '../../context'

export const useRemoveWorkspaceMemberPolicy = (targetMemberId: string) => {
  const { data: currentUser } = useMe()
  const { canWithReason } = usePermissions()
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')
  const { data: workspace } = useWorkspaceQuery(workspaceId, {
    members: true
  })

  const evaluateRemoveWorkspaceMemberPolicy = () => {
    const { members, idOwner } = workspace || {}

    if (!workspace || !members || !idOwner || !currentUser) {
      return {
        allowed: false,
        reason: {
          message: 'You are not allowed to remove this workspace member'
        }
      } as PolicyResult
    }

    const policyContext: WorkspaceRemoveMemberPolicyContext = {
      user: currentUser,
      targetMemberId
    }

    const policyResource: WorkspaceRemoveMemberPolicyResource = {
      workspaceMembers: members,
      workspaceOwnerId: idOwner
    }

    return canWithReason('workspace_remove_member', 'workspace', policyResource, policyContext)
  }

  return {
    evaluateRemoveWorkspaceMemberPolicy
  }
}
