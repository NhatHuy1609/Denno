import React from 'react'

type Props = {
  day: number
  date: Date
  isSelected: boolean
  isCurrentMonth: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isInRange: boolean
  onClick: () => void
}

function CalendarDayButton({
  day,
  date,
  isSelected,
  isCurrentMonth,
  isRangeStart,
  isRangeEnd,
  isInRange,
  onClick
}: Props) {
  const baseClasses = 'w-full h-9 flex items-center justify-center text-sm transition-colors'

  const getButtonClasses = (): string => {
    if (isRangeStart || isRangeEnd) {
      return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 font-medium`
    }

    if (isInRange) {
      return `${baseClasses} bg-blue-100 text-blue-700 font-medium`
    }

    if (isSelected) {
      return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 font-medium`
    }

    if (isCurrentMonth) {
      return `${baseClasses} text-gray-700 hover:bg-gray-100 font-medium`
    }

    return `${baseClasses} text-gray-400 hover:bg-gray-100`
  }

  return (
    <button className={getButtonClasses()} onClick={onClick} type='button'>
      {day}
    </button>
  )
}

export default CalendarDayButton
