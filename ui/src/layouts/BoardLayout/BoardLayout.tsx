import React from 'react'
import WorkspaceHeader from '../WorkspaceLayout/WorkspaceHeader/Header'
import WorkspaceSidebar from '../WorkspaceLayout/WorkspaceSidebar/WorkSidebar'

function BoardLayoutComp({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <WorkspaceHeader />
      <div className='flex items-center'>
        <WorkspaceSidebar />
        <section>{children}</section>
      </div>
    </main>
  )
}

export default BoardLayoutComp
