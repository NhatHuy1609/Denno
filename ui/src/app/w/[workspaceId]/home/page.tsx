'use client'

import React from 'react'
import WorkspaceBoardList from '@/app/_features/Board/List/WorkspaceBoardList'
import WorkspaceInfoCard from '@/app/_features/Workspaces/Info/WorkspaceInfoCard'

function page() {
  return (
    <div className='w-full'>
      <div className='border-b border-gray-300 p-8 pb-12'>
        <WorkspaceInfoCard />
      </div>
      <div className='h-[800px] p-4 pr-0'>
        <WorkspaceBoardList />
      </div>
    </div>
  )
}

export default page
