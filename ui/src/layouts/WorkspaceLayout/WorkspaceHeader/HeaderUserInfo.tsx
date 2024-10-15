import React from 'react'
import { Avatar } from '@/ui'
import { useUser } from '@/app/_providers/AuthProvider/useUser'

function HeaderUserInfo() {
  const { user } = useUser()

  return <Avatar size='sm' src={user?.avatar || ''} name='user-avatar' />
}

export default HeaderUserInfo
