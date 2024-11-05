import React from 'react'
import SidebarHomeNav from './SidebarHomeNav'
import SidebarWorkspaceList from './SidebarWorkspaceList'
import { ScrollArea } from '@/ui'

function WorkspaceHomeSidebar() {
  return (
    <aside className='flex min-w-[250px] max-w-[250px] flex-col pt-12'>
      <SidebarHomeNav />
      <ScrollArea className='mt-2 flex-1 border-t border-stone-300 bg-white pr-4'>
        <h3 className='mt-4 pl-2 text-xs font-semibold text-slate-600'>Workspaces</h3>
        <SidebarWorkspaceList />
      </ScrollArea>
    </aside>
  )
}

export default WorkspaceHomeSidebar
