import React from 'react'
import type { DateRange } from './types'
import { useDatePicker } from './hooks/useDatePicker'
import CalendarGrid from './components/CalendarGrid'
import CalendarNavigation from './components/CalendarNavigation'
import { calendarUtils } from './utils'

interface DatePickerProps {
  initialDate?: Date | null
  initialDateRange?: DateRange
  mode?: 'single' | 'range'
  onDateSelect?: (date: Date) => void
  onDateRangeSelect?: (range: DateRange) => void
}

function DatePicker({
  initialDate = null,
  initialDateRange = { start: null, end: null },
  mode = 'single',
  onDateSelect,
  onDateRangeSelect
}: DatePickerProps) {
  const {
    currentDate,
    selectedDate,
    selectedRange,
    navigateMonth,
    navigateYear,
    handleDateSelect,
    resetRange,
    setRangeFromState
  } = useDatePicker(initialDate, initialDateRange, mode, onDateSelect, onDateRangeSelect)

  return (
    <div className='w-80 rounded-lg bg-white p-1'>
      {/* <CalendarHeader onClose={handleClose} /> */}
      <CalendarNavigation currentDate={currentDate} onNavigateMonth={navigateMonth} onNavigateYear={navigateYear} />
      <CalendarGrid
        mode={mode}
        rangeSelectionStep='start'
        currentDate={currentDate}
        selectedDate={selectedDate}
        selectedRange={selectedRange}
        onDateSelect={handleDateSelect}
        onClearRange={resetRange}
      />
    </div>
  )
}

export default DatePicker
