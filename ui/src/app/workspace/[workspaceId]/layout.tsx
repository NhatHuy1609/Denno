'use client'

import React, { useCallback, useEffect } from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useParams, useRouter } from 'next/navigation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { useSignalR } from '@/app/_providers/SignalRProvider/useSignalR'

function layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { signalRService } = useSignalR()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [userId] = useSyncedLocalStorage(PersistedStateKey.MeId, '')
  const [_1, setRecentAccessWorkspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')

  const onWorkspaceMemberRemoved = useCallback(
    (removedUserId: string) => {
      if (removedUserId === userId) {
        router.replace('/')
        setTimeout(() => {
          router.push(`workspace/${workspaceId}`)
        }, 0)
      }
    },
    [userId, router, workspaceId]
  )

  // Sync recent access workspace id with local storage
  useEffect(() => {
    if (workspaceId) {
      setRecentAccessWorkspaceId(workspaceId as string)
    }

    if (!signalRService) return

    // Join group of workspace hub
    signalRService.invoke('workspace', 'JoinWorkspace', workspaceId)

    // Listen realtime events
    signalRService.on('workspace', 'OnWorkspaceMemberRemoved', onWorkspaceMemberRemoved)

    return () => {
      signalRService.off('workspace', 'OnWorkspaceMemberRemoved', onWorkspaceMemberRemoved)
    }
  }, [workspaceId, signalRService, onWorkspaceMemberRemoved])

  return <>{children}</>
}

export default layout
