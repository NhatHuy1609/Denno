'use client'

import React from 'react'
import BoardLayoutComp from '@/layouts/BoardLayout'

export default function WorkspaceHomeLayout({ children }: { children: React.ReactNode }) {
  return <BoardLayoutComp>{children}</BoardLayoutComp>
}
