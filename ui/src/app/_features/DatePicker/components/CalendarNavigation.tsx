import React from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { MONTHS } from '../constants'

type Props = {
  currentDate: Date
  onNavigateMonth: (direction: number) => void
  onNavigateYear: (direction: number) => void
}

function CalendarNavigation({ currentDate, onNavigateMonth, onNavigateYear }: Props) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-1'>
        <button
          onClick={() => onNavigateYear(-1)}
          className='rounded p-1 transition-colors hover:bg-gray-100'
          type='button'
          aria-label='Previous year'
        >
          <IoChevronBack size={16} className='text-gray-600' />
        </button>
        <button
          onClick={() => onNavigateMonth(-1)}
          className='rounded p-1 transition-colors hover:bg-gray-100'
          type='button'
          aria-label='Previous month'
        >
          <IoChevronBack size={16} className='text-gray-600' />
        </button>
      </div>

      <h3 className='font-semibold text-gray-800'>
        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h3>

      <div className='flex items-center space-x-1'>
        <button
          onClick={() => onNavigateMonth(1)}
          className='rounded p-1 transition-colors hover:bg-gray-100'
          type='button'
          aria-label='Next month'
        >
          <IoChevronForward size={16} className='text-gray-600' />
        </button>
        <button
          onClick={() => onNavigateYear(1)}
          className='rounded p-1 transition-colors hover:bg-gray-100'
          type='button'
          aria-label='Next year'
        >
          <IoChevronForward size={16} className='text-gray-600' />
        </button>
      </div>
    </div>
  )
}

export default CalendarNavigation
