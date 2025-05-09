'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import ReduxProvider from '@/app/_providers/ReduxProvider'
import AuthProvider from '@/app/_providers/AuthProvider/AuthProvider'
import { QueryClientProvider } from '@/app/_providers/QueryClientProvider'
import { Toaster } from '@/ui'
import { SignalRProvider } from '@/app/_providers/SignalRProvider/SignalRProvider'

const ThemeProviderComp = dynamic(() => import('@/app/_components/ThemeProviderComp'), {
  ssr: false
})

const RootLayoutComp = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      <ReduxProvider>
        <SignalRProvider>
          <AuthProvider>
            <ThemeProviderComp>
              <div className='size-full'>{children}</div>
              <Toaster />
            </ThemeProviderComp>
          </AuthProvider>
        </SignalRProvider>
      </ReduxProvider>
    </QueryClientProvider>
  )
}

export default RootLayoutComp
