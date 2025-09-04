'use client'

import React from 'react'
import { WorkspaceLayoutComp } from '@/layouts/WorkspaceLayout'

export default function WorkspaceHomeLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceLayoutComp>{children}</WorkspaceLayoutComp>
}
