'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import ReduxProvider from '@/app/_providers/ReduxProvider'
import AuthProvider from '@/app/_providers/AuthProvider/AuthProvider'
import { QueryClientProvider } from '@/app/_providers/QueryClientProvider'
import { Toaster } from '@/ui'
import { SignalRProvider } from '@/app/_providers/SignalRProvider/SignalRProvider'
import { TooltipProvider } from '@/ui/components/Tooltip'
import { PolicyInitializer } from '@/permissions'

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
              <TooltipProvider>
                <div className='size-full'>{children}</div>
              </TooltipProvider>
              <Toaster />
              <PolicyInitializer />
            </ThemeProviderComp>
          </AuthProvider>
        </SignalRProvider>
      </ReduxProvider>
    </QueryClientProvider>
  )
}

export default RootLayoutComp
