import React from 'react'
import TableViewNavLink from './TableViewNavLink'

function PrimarySidebarWorkspaceViews() {
  const navs = [<TableViewNavLink />]

  return (
    <div className='w-auto'>
      <span className='block pl-3 pt-3 text-sm font-medium text-white'>Workspace Views</span>
      <ul className='mt-1'>
        {navs.map((navComp, index) => (
          <li key={index} className='block cursor-pointer px-4 py-1 hover:bg-white/30'>
            {navComp}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PrimarySidebarWorkspaceViews
