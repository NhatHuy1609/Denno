'use client'

import { useMe } from '@/app/_hooks/query/user/useMe'
import React from 'react'
import LoggedInSection from './LoggedInSection'
import NotLoggedInSection from './NotLoggedInSection'

// This is page for accepting an invite link to a board.
function BoardInviteAcceptPage() {
  const { data: currentUser, isSuccess } = useMe()
  const isLoggedIn = Boolean(currentUser && isSuccess)

  const renderSection = () => {
    if (isLoggedIn) {
      return <LoggedInSection />
    } else {
      return <NotLoggedInSection />
    }
  }

  return <div className='flex w-full justify-center'>{renderSection()}</div>
}

export default BoardInviteAcceptPage
