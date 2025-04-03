import React from 'react'
import MembersPanel from './MembersPanel'

function MembersTabDisplay() {
  return (
    <div className='w-full'>
      <div className='flex w-full flex-col gap-4 border-b border-gray-300 pb-3'>
        <h4 className='text-lg font-medium'>{'Workspace members (2)'}</h4>
        <p className='text-sm'>
          Workspace members can view and join all Workspace visible boards and create new boards in
          the Workspace.
        </p>
      </div>
      <MembersPanel />
    </div>
  )
}

export default MembersTabDisplay
