import React from 'react'
import type { Notification } from '@/entities/notification/notification.types'
import { cn } from '@/lib/styles/utils'
import { useNotificationUI } from '../../helpers/notification-config'
import NotificationHeader from './NotificationHeader'
import NotificationContent from './NotificationContent'
import MarkNotificationAsReadButton from './MarkNotificationAsReadButton'

type Props = {
  notification: Notification
}

function NotificationItem({ notification }: Props) {
  const { id, isRead: isNotificationRead } = notification
  const { header, content } = useNotificationUI(notification)

  return (
    <div
      className={cn('flex w-full items-start gap-2 px-4 py-2', {
        'bg-blue-100': !isNotificationRead
      })}
    >
      <div className='w-full flex-1 overflow-hidden rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.25)]'>
        {header && <NotificationHeader header={header} />}
        <NotificationContent content={content} />
      </div>
      <MarkNotificationAsReadButton notificationId={id} isNotificationRead={isNotificationRead} />
    </div>
  )
}

export default NotificationItem
