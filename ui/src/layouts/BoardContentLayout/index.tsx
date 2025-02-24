import React, { ReactNode } from 'react'
import BoardContentHeader from './BoardContentHeader'

function BoardContentLayoutComp({ children }: { children: ReactNode }) {
  return (
    <div className='size-full h-[calc(100%-var(--primary-sidebar-header-height))] max-w-full overflow-x-scroll bg-sky-500'>
      <BoardContentHeader />
      {children}
    </div>
  )
}

export default BoardContentLayoutComp
