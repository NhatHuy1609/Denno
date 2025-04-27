import React, { useEffect, useState } from 'react'
import { useRequestsManagerContext } from '../../context'
import { GrFormSubtract } from 'react-icons/gr'
import { IoCheckmark } from 'react-icons/io5'

function SelectAllCheckbox() {
  const [checkboxState, setCheckboxState] = useState({
    isAllChecked: false,
    isIndeterminate: false
  })
  const { toggleSelectAllRequestsFn, selectedRequests, workspaceJoinRequests } =
    useRequestsManagerContext()

  const handleToggleSelectAllRequests = () => {
    toggleSelectAllRequestsFn(checkboxState.isAllChecked, checkboxState.isIndeterminate)
  }

  // Update checkbox state based on selectedRequests and workspaceJoinRequests
  useEffect(() => {
    if (selectedRequests.length === workspaceJoinRequests.length) {
      setCheckboxState({
        isAllChecked: true,
        isIndeterminate: false
      })
    } else if (selectedRequests.length === 0) {
      setCheckboxState({
        isAllChecked: false,
        isIndeterminate: false
      })
    } else {
      setCheckboxState({
        isAllChecked: false,
        isIndeterminate: true
      })
    }
  }, [selectedRequests, workspaceJoinRequests])

  return (
    <div className='flex items-center gap-2'>
      <div
        onClick={handleToggleSelectAllRequests}
        className='flex size-[18px] items-center justify-center overflow-hidden rounded-sm border-[1.5px] border-gray-500 bg-[#0076ff]'
      >
        {checkboxState.isAllChecked ? (
          <IoCheckmark className='text-lg font-bold text-white' />
        ) : checkboxState.isIndeterminate ? (
          <GrFormSubtract className='text-lg font-bold text-white' />
        ) : (
          <div className='size-full bg-white' />
        )}
      </div>
      <label className='text-sm'>
        {selectedRequests.length > 0
          ? `${selectedRequests.length} selected `
          : `Select all (${workspaceJoinRequests.length})`}
      </label>
    </div>
  )
}

export default SelectAllCheckbox
