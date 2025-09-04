import React from 'react'
import { useRemoveMemberOptionsContext } from '../../context'

function RemoveRelatedBoardsOption() {
  const { changeRemoveRelatedBoardsOption } = useRemoveMemberOptionsContext()

  const handleOptionChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeRemoveRelatedBoardsOption(event.target.checked)
  }

  return (
    <div className='flex w-full gap-2'>
      <input type='checkbox' onChange={handleOptionChanged} />
      <p className='text-xs font-semibold text-black'>Check this box to remove the member from all boards</p>
    </div>
  )
}

export default RemoveRelatedBoardsOption
