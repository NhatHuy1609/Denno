'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useHubEventListener } from '@/app/_hooks/signalR/useHubEventListener'
import { useHubInvoke } from '@/app/_hooks/signalR/useHubInvoke'

export function useWorkspaceRealtime() {
  const router = useRouter()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [userId] = useSyncedLocalStorage(PersistedStateKey.MeId)

  const invokeHub = useHubInvoke()

  // When user is removed/left → redirect
  const handleKickedOrLeft = (targetUserId: string) => {
    if (userId === targetUserId) {
      router.replace('/')
      setTimeout(() => {
        router.push(`workspace/${workspaceId}`)
      }, 0)
    }
  }

  // Listen to SignalR events
  useHubEventListener('workspace', 'OnWorkspaceMemberRemoved', handleKickedOrLeft)
  useHubEventListener('workspace', 'OnWorkspaceMemberLeft', handleKickedOrLeft)

  // Join workspace group
  useEffect(() => {
    if (!workspaceId) return
    invokeHub('workspace', 'JoinWorkspace', workspaceId).catch((err) => {
      console.error('[SignalR JoinWorkspace error]', err)
    })
  }, [workspaceId, invokeHub])
}
