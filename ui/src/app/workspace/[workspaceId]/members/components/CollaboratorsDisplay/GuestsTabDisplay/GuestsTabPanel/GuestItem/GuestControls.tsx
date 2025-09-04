import React from 'react'
import JoinedBoardAction from './JoinedBoardAction'
import AddToWorkspaceAction from './AddToWorkspaceAction'
import RemoveGuestAction from './RemoveGuestAction'

function GuestControls() {
  return (
    <div className='grid grid-cols-[auto_auto_auto] justify-items-end gap-4'>
      <JoinedBoardAction />
      <AddToWorkspaceAction />
      <RemoveGuestAction />
    </div>
  )
}

export default GuestControls
