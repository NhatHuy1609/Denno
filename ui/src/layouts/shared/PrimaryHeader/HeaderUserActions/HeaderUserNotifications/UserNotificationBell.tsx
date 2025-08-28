import React from 'react'
import { useSignalR } from '@/app/_providers/SignalRProvider/useSignalR'
import { useUserNotifications } from '@/app/_hooks/query/user/useUserNotifications'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import { FiBell } from 'react-icons/fi'

function UserNotificationBell() {
  const currentUserId = getLocalStorageItem(PersistedStateKey.MeId)
  const { data: notifications = [] } = useUserNotifications(currentUserId)

  // Get unread notifications
  const unreadNotifications = notifications.filter((notification) => !notification.isRead)

  return (
    <div className='relative'>
      <FiBell className='text-sm text-[var(--ds-text)]' />
      <div className='absolute right-[-100%] top-[-100%] flex size-5 items-center justify-center rounded-full bg-red-500'>
        <span className='text-xs text-white'>{unreadNotifications.length}</span>
      </div>
    </div>
  )
}

export default UserNotificationBell
