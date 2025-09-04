'use client'

import React from 'react'
import { useWorkspaceLocalStorageSync } from './useWorkspaceLocalStorageSync'
import { useWorkspaceRealtime } from './useWorkspaceRealtime'

function Layout({ children }: { children: React.ReactNode }) {
  useWorkspaceRealtime()
  useWorkspaceLocalStorageSync()

  return <>{children}</>
}

export default Layout
