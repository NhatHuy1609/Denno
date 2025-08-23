import React, { useState } from 'react'
import { RemoveMemberOptionsProvider } from './context'
import RemoveMemberMainOption from './RemoveMemberMainOption'

function RemoveMemberAction() {
  const [removeRelatedBoardsOptionEnable, setRemoveRelatedBoardsOptionEnable] = useState(false)

  const handleChangeRemoveRelatedBoardsOption = (value: boolean) => {
    setRemoveRelatedBoardsOptionEnable(value)
  }

  return (
    <RemoveMemberOptionsProvider
      value={{
        removeRelatedBoards: removeRelatedBoardsOptionEnable,
        changeRemoveRelatedBoardsOption: handleChangeRemoveRelatedBoardsOption
      }}
    >
      <div className='w-full'>
        <h3 className='text-center text-sm font-medium text-slate-700'>Remove member</h3>
        <div className='flex w-full flex-col'>
          <RemoveMemberMainOption />
        </div>
      </div>
    </RemoveMemberOptionsProvider>
  )
}

export default RemoveMemberAction
