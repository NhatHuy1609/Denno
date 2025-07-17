'use client'

import React from 'react'
import BoardContentLayoutComp from '@/layouts/BoardContentLayout'
import { useMe } from '@/app/_hooks/query/user/useMe'

function BoardContentLayout({ children }: { children: React.ReactNode }) {
  const { data: currentUser } = useMe()

  if (currentUser) {
    return <BoardContentLayoutComp>{children}</BoardContentLayoutComp>
  }

  return <>{children}</>
}

export default BoardContentLayout
