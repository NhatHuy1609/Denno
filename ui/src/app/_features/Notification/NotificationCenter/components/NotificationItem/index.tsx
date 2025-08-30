import React from 'react'
import type { Notification } from '@/entities/notification/notification.types'
import NotificationHeader from './NotificationHeader'
import NotificationContent from './NotificationContent'
import { useNotificationUI } from '../../helpers/notification-config'

type Props = {
  notification: Notification
}

function NotificationItem({ notification }: Props) {
  const { header, content } = useNotificationUI(notification)

  return (
    <div className='w-full rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.25)]'>
      {header && <NotificationHeader header={header} />}
      <NotificationContent content={content} />
    </div>
  )
}

export default NotificationItem
