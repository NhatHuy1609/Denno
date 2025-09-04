import React from 'react'
import LogoutSection from './LogoutSection'
import UserInfoSection from './UserInfoSection'
import { Separator } from '@radix-ui/react-dropdown-menu'

function HeaderUserInfoPanel() {
  return (
    <div className='flex w-[320px] w-full flex-col gap-2 p-4'>
      <UserInfoSection />
      <Separator className='h-px w-full bg-slate-200' />
      <LogoutSection />
    </div>
  )
}

export default HeaderUserInfoPanel
