import React from 'react'

function DropdownOtherActions() {
  return (
    <>
      <div className='flex flex-col px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>
        <span className='font-semibold'>Leave board</span>
      </div>
      <div className='flex flex-col px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>
        <span className='font-semibold'>Remove from board</span>
      </div>
    </>
  )
}

export default DropdownOtherActions
