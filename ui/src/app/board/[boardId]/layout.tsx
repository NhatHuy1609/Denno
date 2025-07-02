'use client'

import React from 'react'
import BoardContentLayoutComp from '@/layouts/BoardContentLayout'

function BoardContentLayout({ children }: { children: React.ReactNode }) {
  return <BoardContentLayoutComp>{children}</BoardContentLayoutComp>
}

export default BoardContentLayout
