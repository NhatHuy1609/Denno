import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useUserNotifications } from '@/app/_hooks/query/user/useUserNotifications'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import NotificationList from './components/NotificationList'

function NotificationCenter() {
  const currentUserId = getLocalStorageItem(PersistedStateKey.MeId)
  const { data: notifications = [] } = useUserNotifications(currentUserId)

  return (
    <div className='flex w-[440px] flex-col'>
      <div className='w-full border-b border-gray-300 pb-4'>
        <h1 className='text-xl font-medium'>Notifications</h1>
      </div>
      <NotificationList notifications={notifications} />
    </div>
  )
}

export default NotificationCenter
