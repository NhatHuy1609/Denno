import React from 'react'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useUserNotifications } from '@/app/_hooks/query/user/useUserNotifications'

function NotificationCenter() {
  const currentUserId = getLocalStorageItem(PersistedStateKey.MeId)
  const { data: notifications } = useUserNotifications(currentUserId)

  console.log('Notifications: ', notifications)

  return <div>NotificationCenter</div>
}

export default NotificationCenter
