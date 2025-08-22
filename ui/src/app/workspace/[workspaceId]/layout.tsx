'use client'

import React, { useEffect } from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useParams } from 'next/navigation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { useSignalR } from '@/app/_providers/SignalRProvider/useSignalR'

function layout({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [_1, setRecentAccessWorkspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')
  const { signalRService } = useSignalR()

  // Sync recent access workspace id with local storage
  useEffect(() => {
    if (workspaceId) {
      setRecentAccessWorkspaceId(workspaceId as string)
    }

    // Join group of workspace hub
    if (signalRService) {
      signalRService.invoke('workspace', 'JoinWorkspace', workspaceId)
    }
  }, [workspaceId, signalRService])

  return <>{children}</>
}

export default layout
