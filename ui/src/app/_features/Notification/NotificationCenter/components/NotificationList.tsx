import { Notification } from '@/entities/notification/notification.types'
import React from 'react'
import NotificationItem from './NotificationItem'

type Props = {
  notifications: Notification[]
}

function NotificationList({ notifications }: Props) {
  return (
    <div className='mt-6 flex w-full flex-col gap-4'>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

export default NotificationList
