import React from 'react'
import { NotificationHeaderInfo } from '../../helpers/types'

type Props = {
  header: NotificationHeaderInfo
}

function NotificationHeader({ header }: Props) {
  const { entityIcon: headerIcon, entityName: headerTitle } = header

  return (
    <div className='flex w-full items-center justify-start gap-2 rounded-t-md bg-white p-2'>
      {headerIcon}
      <span className='text-sm'>{headerTitle}</span>
    </div>
  )
}

export default NotificationHeader
