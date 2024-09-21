'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const ThemeProviderComp = dynamic(() => import('@/components/ThemeProviderComp'), { ssr: false })

const RootLayoutComp = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProviderComp>
      <div>{children}</div>
    </ThemeProviderComp>
  )
}

export default RootLayoutComp
