'use client'

import React from 'react'
import WorkspaceHeader from './WorkspaceHeader/Header'
import WorkspaceHomeSidebar from './WorkspaceSidebar/HomeSidebar'

export default function WorkspaceLayoutComp({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main className='flex flex-col'>
      <WorkspaceHeader />
      <div className='relative flex max-h-[calc(100vh-50px)] min-h-[calc(100vh-50px)] w-full justify-center overflow-y-auto pl-16'>
        <WorkspaceHomeSidebar />
        <section className='max-h-full flex-1 overflow-y-auto py-12 pl-8 pr-16'>
          {children}
        </section>
      </div>
    </main>
  )
}
