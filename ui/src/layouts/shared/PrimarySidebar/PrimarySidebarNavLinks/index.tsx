import React from 'react'
import BoardsNavLink from './BoardsNavLink'
import MembersNavLink from './MembersNavLink'
import WorkspaceSettingsNavLink from './WorkspaceSettingsNavLink'

function PrimarySidebarNavLinks() {
  const navs = [<BoardsNavLink />, <MembersNavLink />, <WorkspaceSettingsNavLink />]

  return (
    <ul className='mt-2 flex list-none flex-col'>
      {navs.map((navItem, index) => (
        <li key={index} className='block cursor-pointer px-4 py-[6px] hover:bg-white/30'>
          {navItem}
        </li>
      ))}
    </ul>
  )
}

export default PrimarySidebarNavLinks
