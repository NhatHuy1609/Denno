'use client'

import React, { useEffect } from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useParams } from 'next/navigation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'

function layout({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [_1, setRecentAccessWorkspaceId] = useSyncedLocalStorage(
    PersistedStateKey.RecentAccessWorkspace,
    ''
  )

  // Sync recent access workspace id with local storage
  useEffect(() => {
    if (workspaceId) {
      setRecentAccessWorkspaceId(workspaceId as string)
    }
  }, [workspaceId])

  return <>{children}</>
}

export default layout
