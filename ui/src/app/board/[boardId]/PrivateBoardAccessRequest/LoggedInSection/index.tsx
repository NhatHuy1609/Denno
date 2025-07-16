import React from 'react'
import { userTypes } from '@/entities/user'
import { useRouter } from 'next/navigation'
import Avatar from '@/ui/components/Avatar'
import UnderlineLinkButton from '@/app/_components/UnderlineLinkButton'
import { useMe } from '@/app/_hooks/query/user/useMe'

export default function LoggedInSection() {
  const router = useRouter()
  const { data: currentLoggedInUser } = useMe()

  const handleSwitchAccount = () => {
    router.push('/sign-in')
  }

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <span className='text-sm text-gray-500'>You are logged in as</span>
        <UnderlineLinkButton
          value='Switch account'
          className='text-base'
          onClick={handleSwitchAccount}
        />
      </div>
      <LoggedInUserDisplay user={currentLoggedInUser} />
    </div>
  )
}

function LoggedInUserDisplay({ user }: { user?: userTypes.User }) {
  const { fullName = '', avatar = '', email = '' } = user || {}

  return (
    <div className='my-2 flex w-full items-center gap-2'>
      <Avatar src={avatar} name={fullName} />
      <div className='flex flex-1 flex-col justify-between'>
        <span className='text-base text-black'>{fullName}</span>
        <span className='text-sm text-gray-500'>{email}</span>
      </div>
    </div>
  )
}
