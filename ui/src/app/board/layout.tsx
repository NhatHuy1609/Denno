'use client'

import '@/app/board-page-themes.css'
import React, { useEffect } from 'react'
import BoardLayoutComp from '@/layouts/BoardLayout'
import { useMe } from '../_hooks/query/user/useMe'
import LandingHeader from '../_components/LandingHeader'

function MainBoardLayout({ children }: { children: React.ReactNode }) {
  const { data: currentUser } = useMe()

  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'board')

    return () => {
      document.documentElement.setAttribute('data-page', 'default')
    }
  })

  if (!currentUser) {
    return (
      // Layout 1
      <section className='size-full'>
        <LandingHeader />
        {children}
      </section>
    )
  }

  return <BoardLayoutComp>{children}</BoardLayoutComp>
}

export default MainBoardLayout
