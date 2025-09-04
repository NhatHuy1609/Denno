'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

export function useWorkspaceLocalStorageSync() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [, setRecentAccessWorkspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace)

  // Sync recent accessed workspace id with local storage
  useEffect(() => {
    if (workspaceId) {
      setRecentAccessWorkspaceId(workspaceId)
    }
  }, [workspaceId, setRecentAccessWorkspaceId])
}
