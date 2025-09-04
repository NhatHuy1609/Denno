'use client'

import React, { ReactNode } from 'react'
import { WorkspaceLayoutComp } from '@/layouts/WorkspaceLayout'

function layout({ children }: { children: ReactNode }) {
  return <WorkspaceLayoutComp>{children}</WorkspaceLayoutComp>
}

export default layout
