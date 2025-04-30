import React from 'react'
import type { Notification } from '@/entities/notification/notification.types'
import { getNotificationDataDisplay } from '../../helpers/get-notification-data-display'
import NotificationHeader from './NotificationHeader'
import NotificationContent from './NotificationContent'

type Props = {
  notification: Notification
}

function NotificationItem({ notification }: Props) {
  const { header, content } = getNotificationDataDisplay(notification)

  return (
    <div className='w-full rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.25)]'>
      <NotificationHeader header={header} />
      <NotificationContent content={content} />
    </div>
  )
}

export default NotificationItem
