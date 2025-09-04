import React, { useMemo, useState } from 'react'
import { useUserNotifications } from '@/app/_hooks/query/user/useUserNotifications'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import NotificationList from './components/NotificationList'
import ToggleReadStatusButton from './components/ToggleReadStatusButton'

function NotificationCenter() {
  const currentUserId = getLocalStorageItem(PersistedStateKey.MeId)
  const { data: notifications = [] } = useUserNotifications(currentUserId)

  const [unreadStatus, setUnreadStatus] = useState(false) // false means show all, true means show only unread
  const notificationsDisplay = useMemo(() => {
    return unreadStatus ? notifications.filter((notification) => !notification.isRead) : notifications
  }, [notifications, unreadStatus])

  const handleToggleUnreadStatus = () => {
    setUnreadStatus((prev) => !prev)
  }

  return (
    <div className='flex w-[440px] flex-col'>
      <div className='flex w-full items-center justify-between border-b border-gray-300 p-4'>
        <h1 className='text-xl font-medium'>Notifications</h1>
        <ToggleReadStatusButton unreadStatus={unreadStatus} onToggle={handleToggleUnreadStatus} />
      </div>
      {notificationsDisplay.length > 0 ? (
        <NotificationList notifications={notificationsDisplay} />
      ) : (
        <div className='w-full py-12 text-center text-lg font-semibold text-gray-400'>No notification yet</div>
      )}
    </div>
  )
}

export default NotificationCenter
