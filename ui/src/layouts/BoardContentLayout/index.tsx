import React, { ReactNode } from 'react'
import BoardContentHeader from './BoardContentHeader'

function BoardContentLayoutComp({ children }: { children: ReactNode }) {
  return (
    <div className='w-full'>
      <BoardContentHeader />
      {children}
    </div>
  )
}

export default BoardContentLayoutComp
