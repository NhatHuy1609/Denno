import React from 'react'
import LandingHeader from '@/app/_components/LandingHeader'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full'>
      <LandingHeader />
      <div className='w-full'>{children}</div>
    </div>
  )
}

export default PublicLayout
