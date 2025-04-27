'use client'

import React from 'react'
import BoardView from '@/app/_features/BoardViews/BoardView'
import BoardContentHeader from '@/layouts/BoardContentLayout/BoardContentHeader'

function BoardHomePage() {
  return (
    <div className='flex size-full max-w-full flex-col'>
      <BoardContentHeader />
      <BoardView />
    </div>
  )
}

export default BoardHomePage
