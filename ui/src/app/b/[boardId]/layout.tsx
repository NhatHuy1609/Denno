'use client'

import React from 'react'
import BoardContentLayoutComp from '@/layouts/BoardContentLayout'

function SecondaryLayout({ children }: { children: React.ReactNode }) {
  return <BoardContentLayoutComp>{children}</BoardContentLayoutComp>
}

export default SecondaryLayout
