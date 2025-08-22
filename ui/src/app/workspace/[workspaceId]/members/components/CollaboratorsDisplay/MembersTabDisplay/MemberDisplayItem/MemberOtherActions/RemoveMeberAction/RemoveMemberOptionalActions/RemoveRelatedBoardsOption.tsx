import React from 'react'
import { useRemoveMemberOptionsContext } from '../context'

function RemoveRelatedBoardsOption() {
  return (
    <div className='flex w-full gap-2'>
      <input type='checkbox' />
      <p className='text-xs font-semibold text-black'>Check this box to remove the member from all boards</p>
    </div>
  )
}

export default RemoveRelatedBoardsOption
