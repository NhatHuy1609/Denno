import { Notification } from '@/entities/notification/notification.types'
import React, { useEffect, useState } from 'react'
import NotificationItem from './NotificationItem'
import UnderlineLinkButton from '@/app/_components/UnderlineLinkButton'
import useMarkAllNotificationsAsReadMutation from '@/app/_hooks/mutation/notification/useMarkAllNotificationsAsReadMutation copy'
import { useQueryClient } from '@tanstack/react-query'
import { UserQueries } from '@/entities/user'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

type Props = {
  notifications: Notification[]
}

function NotificationList({ notifications }: Props) {
  const queryClient = useQueryClient()
  const [currentUserId] = useSyncedLocalStorage(PersistedStateKey.MeId)
  const [enableMarkAllAsRead, setEnableMarkAllAsRead] = useState(false)

  const { mutateAsync: markAllNotificationsAsReadAsync } = useMarkAllNotificationsAsReadMutation({
    onSuccess() {
      const queryKey = UserQueries.usersNotificationsQuery(currentUserId).queryKey
      const prevNotifications = queryClient.getQueryData(queryKey)

      // Optimistically update all notifications as read in the cache
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return oldData
        return oldData.map((notification) => ({
          ...notification,
          isRead: true
        }))
      })

      return { prevNotifications }
    },
    onError: (error, variables, context) => {
      const queryKey = UserQueries.usersNotificationsQuery(currentUserId).queryKey
      if (context) {
        queryClient.setQueryData(queryKey, context.prevNotifications)
      }
      console.error(error)
    }
  })

  // Check if there are any unread notifications to enable/disable "Mark all as read" button
  useEffect(() => {
    const hasUnreadNotifications = notifications.some((notification) => !notification.isRead)
    if (hasUnreadNotifications) {
      setEnableMarkAllAsRead(true)
    } else {
      setEnableMarkAllAsRead(false)
    }
  }, [notifications])

  const handleClickMarkAllAsReadButton = async () => {
    await markAllNotificationsAsReadAsync()
  }

  return (
    <div className='w-full'>
      {enableMarkAllAsRead && (
        <div className='flex w-full justify-end px-2'>
          <UnderlineLinkButton value='Mark all as read' className='my-2' onClick={handleClickMarkAllAsReadButton} />
        </div>
      )}
      <div className='flex w-full flex-col'>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}

export default NotificationList
