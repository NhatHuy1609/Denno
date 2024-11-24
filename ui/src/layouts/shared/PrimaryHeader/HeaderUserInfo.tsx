import React from 'react'
import { Avatar } from '@/ui'
import { useUser } from '@/app/_providers/AuthProvider/useUser'
import DefaultAvatarUser from 'public/default-avatar-user.png'

function HeaderUserInfo() {
  const { user } = useUser()

  const { avatar = '' } = user || {}

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
