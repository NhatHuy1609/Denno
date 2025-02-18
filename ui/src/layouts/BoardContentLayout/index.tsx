import React, { ReactNode } from 'react'
import BoardContentHeader from './BoardContentHeader'

function BoardContentLayoutComp({ children }: { children: ReactNode }) {
  return (
    <div className='h-[calc(100%-var(--primary-sidebar-header-height))] w-full'>
      <BoardContentHeader />
      {children}
    </div>
  )
}

export default BoardContentLayoutComp
