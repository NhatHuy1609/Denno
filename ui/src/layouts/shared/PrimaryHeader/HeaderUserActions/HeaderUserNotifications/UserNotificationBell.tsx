import React from 'react'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { FiBell } from 'react-icons/fi'
import { useHubEventListener } from '@/app/_hooks/signalR/useHubEventListener'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'

function UserNotificationBell() {
  const [newNotificationCount, setNewNotificationCount] = useSyncedLocalStorage(PersistedStateKey.NewNotificationCount)

  useHubEventListener('notification', 'ReceiveActionNotification', () => {
    setNewNotificationCount((prev) => prev + 1)
  })

  const handleClickNotificationTrigger = () => {
    setNewNotificationCount(0)
  }

  return (
    <div className='relative' onClick={handleClickNotificationTrigger}>
      <FiBell className='text-sm text-[var(--ds-text)]' />
      {newNotificationCount > 0 && (
        <div className='absolute right-[-100%] top-[-100%] flex size-5 items-center justify-center rounded-full bg-red-500'>
          <span className='text-xs text-white'>{newNotificationCount}</span>
        </div>
      )}
    </div>
  )
}

export default UserNotificationBell
