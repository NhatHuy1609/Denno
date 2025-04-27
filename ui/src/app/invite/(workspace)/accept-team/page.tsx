'use client'

import React from 'react'
import { useMe } from '@/app/_hooks/query/user/useMe'
import LoggedInSection from './LoggedInSection'
import NotLoggedInSection from './NotLoggedInSection'

// This is page for accepting an invite link to a workspace.
function WorkspaceInviteAccept() {
  const { data: currentUser } = useMe()
  const isLoggedIn = Boolean(currentUser)

  const renderSection = () => {
    if (isLoggedIn) {
      return <LoggedInSection />
    } else {
      return <NotLoggedInSection />
    }
  }

  return <div className='flex w-full justify-center'>{renderSection()}</div>
}

export default WorkspaceInviteAccept
