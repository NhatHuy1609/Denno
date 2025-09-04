import { Avatar } from '@/ui'
import React from 'react'

function GuestInformation({ name, email, avatar }: { name: string; email: string; avatar: string }) {
  return (
    <div className='flex flex-1 basis-[264px] items-center gap-4'>
      <Avatar src={avatar} name="user's avatar" />
      <div className='flex flex-col'>
        <span className='text-base font-semibold text-black'>{name}</span>
        <span className='text-[13px] text-slate-600'>@{email.slice(0, email.indexOf('@'))}</span>
      </div>
    </div>
  )
}

export default GuestInformation
