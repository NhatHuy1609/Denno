import React from 'react'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { Avatar } from '@/ui'

function UserInfoSection() {
  const { data: loggedInUserData } = useMe()
  const { avatar = '', fullName, email } = loggedInUserData || {}

  return (
    <div className='w-full'>
      <h3 className='text-sm font-medium text-slate-500'>ACCOUNT</h3>
      <div className='mt-2 flex w-full gap-2'>
        <Avatar size='lg' src={avatar} name='user-avatar' />
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-medium text-slate-600'>{fullName}</span>
          <span className='text-xs font-medium text-gray-400'>{email}</span>
        </div>
      </div>
    </div>
  )
}

export default UserInfoSection
