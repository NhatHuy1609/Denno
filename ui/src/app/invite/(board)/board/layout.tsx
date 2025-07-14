'use client'

import { useMe } from '@/app/_hooks/query/user/useMe'
import React from 'react'
import PrivateLayout from './_layouts/PrivateLayout'
import PublicLayout from './_layouts/PublicLayout'

function BoardInviteLayout({ children }: { children: React.ReactNode }) {
  const { data: currentUser } = useMe()
  const LayoutComp = currentUser ? PrivateLayout : PublicLayout

  return <LayoutComp>{children}</LayoutComp>
}

export default BoardInviteLayout
