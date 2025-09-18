import React from 'react'
import { HiXMark } from 'react-icons/hi2'

type Props = {
  onClose: () => void
}

function CalendarHeader({ onClose }: Props) {
  return (
    <div className='flex items-center justify-between border-b border-gray-200 p-4'>
      <h2 className='text-lg font-semibold text-gray-800'>Dates</h2>
      <button
        onClick={onClose}
        className='p-1 text-gray-400 transition-colors hover:text-gray-600'
        type='button'
        aria-label='Close date picker'
      >
        <HiXMark size={10} />
      </button>
    </div>
  )
}

export default CalendarHeader
