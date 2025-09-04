import React from 'react'
import RemoveGuestMainOption from './RemoveGuestMainOption'

function RemoveGuestPanel() {
  return (
    <div className='w-full py-2'>
      <h3 className='text-center text-sm font-medium text-slate-700'>Remove Guest</h3>
      <div className='mt-2 flex w-full flex-col'>
        <RemoveGuestMainOption />
      </div>
    </div>
  )
}

export default RemoveGuestPanel
