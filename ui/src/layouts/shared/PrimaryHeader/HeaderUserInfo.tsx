import React from 'react'
import { Avatar } from '@/ui'
import { useMe } from '@/app/_hooks/query/user/useMe'
import DefaultAvatarUser from 'public/default-avatar-user.png'

function HeaderUserInfo() {
  const { data: loggedInUserData } = useMe()

  console.log('USER: ', loggedInUserData)

  const { avatar = '' } = loggedInUserData || {}

  return (
    <Avatar
      size='sm'
      src={avatar || ''}
      name='user-avatar'
      fallback={!avatar && DefaultAvatarUser}
    />
  )
}

export default HeaderUserInfo
