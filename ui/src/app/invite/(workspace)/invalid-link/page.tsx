'use client'

import { useMe } from '@/app/_hooks/query/user/useMe'
import React from 'react'
import NotLoggedInSection from './NotLoggedInSection'
import LoggedInSection from './LoggedInSection'

function WorkspaceInvalidLinkPage() {
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

export default WorkspaceInvalidLinkPage
