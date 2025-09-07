'use client'
import { useEffect } from 'react'
import { useMe } from '../_hooks/query/user/useMe'
import { useRouter } from 'next/navigation'
import { useSyncedLocalStorage } from '../_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

function UserChecking() {
  const router = useRouter()
  const { data: currentUser } = useMe()
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace)

  useEffect(() => {
    if (!currentUser) {
      router.push('/general')
      return
    }

    router.push(`/workspace/${workspaceId}/home`)
  }, [currentUser, router])

  return <></>
}

export default UserChecking
