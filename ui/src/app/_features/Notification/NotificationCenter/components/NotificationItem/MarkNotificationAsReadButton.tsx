import React from 'react'
import { cn } from '@/lib/styles/utils'
import { notificationTypes } from '@/entities/notification'
import TooltipWrapper from '@/app/_components/TooltipWrapper'
import useMarkNotificationAsReadMutation from '@/app/_hooks/mutation/notification/useMarkNotificationAsReadMutation'
import { useQueryClient } from '@tanstack/react-query'
import { UserQueries } from '@/entities/user'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import useMarkNotificationAsUnreadMutation from '@/app/_hooks/mutation/notification/useMarkNotificationAsUnreadMutation'

type Props = {
  notificationId: notificationTypes.Notification['id']
  isNotificationRead: boolean
}

function MarkNotificationAsReadButton({ notificationId, isNotificationRead }: Props) {
  const queryClient = useQueryClient()
  const [currentUserId] = useSyncedLocalStorage(PersistedStateKey.MeId)

  const { mutateAsync: markNotificationAsReadAsync } = useMarkNotificationAsReadMutation({
    onMutate: () => {
      const queryKey = UserQueries.usersNotificationsQuery(currentUserId).queryKey
      const prevNotifications = queryClient.getQueryData(queryKey)

      // Optimistically update the notification's read status in the cache
      queryClient.setQueryData(queryKey, (oldNotifications) => {
        if (!oldNotifications) return oldNotifications

        return oldNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      })

      return { prevNotifications }
    },
    onError: (error, variables, context) => {
      if (context) {
        const queryKey = UserQueries.usersNotificationsQuery(currentUserId).queryKey
        queryClient.setQueryData(queryKey, context.prevNotifications)
      }
    }
  })

  const { mutateAsync: markNotificationAsUnreadAsync } = useMarkNotificationAsUnreadMutation({
    onMutate: () => {
      const queryKey = UserQueries.usersNotificationsQuery(currentUserId).queryKey
      const prevNotifications = queryClient.getQueryData(queryKey)

      // Optimistically update the notification's unread status in the cache
      queryClient.setQueryData(queryKey, (oldNotifications) => {
        if (!oldNotifications) return oldNotifications

        return oldNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: false } : notification
        )
      })

      return { prevNotifications }
    },
    onError: (error, variables, context) => {
      if (context) {
        const queryKey = UserQueries.usersNotificationsQuery(currentUserId).queryKey
        queryClient.setQueryData(queryKey, context.prevNotifications)
      }
    }
  })

  const handleClickMarkNotificationButton = async () => {
    if (isNotificationRead) {
      await markNotificationAsUnreadAsync({
        notificationId
      })
    } else {
      await markNotificationAsReadAsync({
        notificationId
      })
    }
  }

  return (
    <TooltipWrapper content={isNotificationRead ? 'Mark as unread' : 'Mark as read'} delayDuration={0}>
      <button
        type='button'
        className='group flex aspect-square w-6 items-center justify-center rounded-sm p-1 hover:bg-blue-100'
        onClick={handleClickMarkNotificationButton}
      >
        <span
          className={cn('size-full rounded-full border border-gray-500 group-hover:border-blue-500', {
            'bg-blue-600': !isNotificationRead
          })}
        />
      </button>
    </TooltipWrapper>
  )
}

export default MarkNotificationAsReadButton
