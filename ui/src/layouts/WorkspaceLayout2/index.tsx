import React from 'react'
import PrimarySidebar from '../shared/PrimarySidebar'
import PrimaryHeader from '../shared/PrimaryHeader'

function WorkspaceLayout2({ children }: { children: React.ReactNode }) {
  return (
    <main className='h-screen w-full'>
      <PrimaryHeader />
      <section className='max-w-screen relative z-[1] flex h-[calc(100%-var(--header-height))]'>
        <PrimarySidebar />
        <div className='h-full flex-1 overflow-y-scroll'>{children}</div>
      </section>
    </main>
  )
}

export default WorkspaceLayout2
