import React, { useState } from 'react'
import RemoveMemberMainActions from './RemoveMemberMainActions'
import RemoveMemberOptionalActions from './RemoveMemberOptionalActions'
import { RemoveMemberOptionsProvider } from './context'

function RemoveMemberAction() {
  const [removeRelatedBoardsOptionEnable, setRemoveRelatedBoardsOptionEnable] = useState(false)

  const handleToggleRemoveRelatedBoardsOption = () => {
    setRemoveRelatedBoardsOptionEnable((prev) => !prev)
  }

  return (
    <RemoveMemberOptionsProvider
      value={{
        removeRelatedBoards: removeRelatedBoardsOptionEnable,
        toggleRemoveRelatedBoards: handleToggleRemoveRelatedBoardsOption
      }}
    >
      <div className='w-full'>
        <h3 className='text-center text-sm font-medium text-slate-700'>Remove member</h3>
        <div className='flex w-full flex-col'>
          <RemoveMemberMainActions />
          <RemoveMemberOptionalActions />
        </div>
      </div>
    </RemoveMemberOptionsProvider>
  )
}

export default RemoveMemberAction
