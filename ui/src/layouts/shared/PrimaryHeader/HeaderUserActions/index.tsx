import React from 'react'
import HeaderInputSearch from './HeaderInputSearch'
import HeaderInfo from './HeaderInfo'
import { HeaderPopupItem } from '../types'
import HeaderUserInfo from './HeaderUserInfo'
import UserNotifications from './HeaderUserNotifications/UserNotifications'
import UserNotificationBell from './HeaderUserNotifications/UserNotificationBell'

function HeaderUserActions() {
  const infoList: HeaderPopupItem[] = [
    {
      triggerItem: <UserNotificationBell />,
      activeItem: <UserNotifications />
    },
    { triggerItem: <HeaderUserInfo /> }
  ]

  return (
    <div className='flex items-center gap-2'>
      <HeaderInputSearch />
      <HeaderInfo infoList={infoList} />
    </div>
  )
}

export default HeaderUserActions
