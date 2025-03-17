'use client'

import '@/app/board-page-themes.css'
import React, { useEffect } from 'react'
import BoardLayoutComp from '@/layouts/BoardLayout'

function MainBoardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'board')

    return () => {
      document.documentElement.setAttribute('data-page', 'default')
    }
  })

  return <BoardLayoutComp>{children}</BoardLayoutComp>
}

export default MainBoardLayout
