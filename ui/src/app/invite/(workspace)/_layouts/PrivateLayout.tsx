import React from 'react'
import PrimaryHeader from '@/layouts/shared/PrimaryHeader'

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full'>
      <PrimaryHeader />
      <div className='w-full'>{children}</div>
    </div>
  )
}

export default PrivateLayout
