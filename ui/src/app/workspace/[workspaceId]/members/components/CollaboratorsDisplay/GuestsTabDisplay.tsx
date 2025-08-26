import React from 'react'

function GuestsTabDisplay() {
  return (
    <div className='w-full'>
      <div className='flex w-full flex-col gap-4 border-b border-gray-300 pb-3'>
        <h4 className='text-lg font-medium'>{`Guests (${0})`}</h4>
        <p className='text-sm'>Guests can only view and edit the boards to which they've been added.</p>
      </div>
    </div>
  )
}

export default GuestsTabDisplay
