'use client'

import React from 'react'
import { useMe } from '../../_hooks/query/user/useMe'
import PrivateLayout from './_layouts/PrivateLayout'
import PublicLayout from './_layouts/PublicLayout'

function WorkspaceInviteLayout({ children }: { children: React.ReactNode }) {
  const { data: currentUser } = useMe()
  const LayoutComp = currentUser ? PrivateLayout : PublicLayout

  return <LayoutComp>{children}</LayoutComp>
}

export default WorkspaceInviteLayout
