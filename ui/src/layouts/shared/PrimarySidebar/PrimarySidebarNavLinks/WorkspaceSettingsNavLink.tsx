import React from 'react'
import { IoMdSettings } from 'react-icons/io'
import { FaAngleDown } from 'react-icons/fa6'

function WorkspaceSettingsNavLink() {
  return (
    <div className='relative flex items-center gap-2'>
      <span className='block flex aspect-[1/1] w-6 items-center justify-center'>
        <IoMdSettings className='text-lg text-white' />
      </span>
      <span className='text-sm text-white'>Workspaces settings</span>
      <span className='absolute right-[-8px] top-0 block flex size-6 items-center justify-center'>
        <FaAngleDown className='text-sm text-white' />
      </span>
    </div>
  )
}

export default WorkspaceSettingsNavLink
