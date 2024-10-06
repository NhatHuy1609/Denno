'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import AuthProvider from '@/app/_providers/AuthProvider/AuthProvider'
import ReduxProvider from '@/app/_providers/ReduxProvider'
import { QueryClientProvider } from '@/app/_providers/QueryClientProvider'

const ThemeProviderComp = dynamic(
  () => import('@/app/_components/ThemeProviderComp'),
  {
    ssr: false
  }
)

const RootLayoutComp = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      <ReduxProvider>
        <AuthProvider>
          <ThemeProviderComp>
            <div>{children}</div>
          </ThemeProviderComp>
        </AuthProvider>
      </ReduxProvider>
    </QueryClientProvider>
  )
}

export default RootLayoutComp
