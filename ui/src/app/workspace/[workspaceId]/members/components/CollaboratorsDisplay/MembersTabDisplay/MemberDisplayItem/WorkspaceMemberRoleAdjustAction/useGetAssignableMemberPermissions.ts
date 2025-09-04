import { useEffect, useState } from 'react'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { getAssignableWorkspacePermissions } from './get-assignable-permissions'

export const useGetAssignableMemberPermissions = (targetMemberId: string) => {
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')

  const { data: currentUser } = useMe()
  const { data: workspace } = useWorkspaceQuery(workspaceId, { members: true })

  const { members: workspaceMembers } = workspace || {}

  const [isLoading, setIsLoading] = useState(false)
  const [assignablePermissions, setAssignablePermissions] = useState<
    ReturnType<typeof getAssignableWorkspacePermissions>
  >([])
  const [alertMessage, setAlertMessage] = useState<string | undefined>()

  useEffect(() => {
    if (!currentUser || !workspace || !workspaceMembers) return

    setIsLoading(true)

    const result = getAssignableWorkspacePermissions(
      { user: currentUser, targetMemberId },
      { workspaceOwnerId: workspace.idOwner, workspaceMembers }
    )

    setAssignablePermissions(result)
    setAlertMessage(result.find((p) => p.alert)?.alert)

    setIsLoading(false)
  }, [currentUser, targetMemberId, workspace, workspaceMembers])

  return { isLoading, assignablePermissions, alertMessage, workspaceId }
}
