import React, { useState } from 'react'
import { useRequestsManagerContext } from '../../context'

function SelectAllCheckbox() {
  const [isChecked, setIsChecked] = useState(false)
  const { selectAllRequestsFn, selectedRequests, workspaceJoinRequests } =
    useRequestsManagerContext()

  const handleToggleSelectAllRequests = () => {
    // If all requests are not selected and checkbox is checked then will not trigger selectAllRequestsFn again
    if (isChecked && selectedRequests.length === 0) {
      setIsChecked(false)
      return
    }

    if (!isChecked && selectedRequests.length === workspaceJoinRequests.length) {
      setIsChecked(true)
      return
    }

    selectAllRequestsFn && selectAllRequestsFn()
    setIsChecked(!isChecked)
  }

  return (
    <div className='flex items-center gap-2'>
      <input
        checked={isChecked}
        type='checkbox'
        className='size-4'
        onChange={handleToggleSelectAllRequests}
      />
      <label className='text-sm'>{`Select all (0)`}</label>
    </div>
  )
}

export default SelectAllCheckbox
