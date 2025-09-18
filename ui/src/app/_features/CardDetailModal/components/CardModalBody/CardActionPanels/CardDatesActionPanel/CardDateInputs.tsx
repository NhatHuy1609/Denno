import { DateRange } from '@/app/_features/DatePicker/types'
import { calendarUtils } from '@/app/_features/DatePicker/utils'
import React, { useEffect, useState } from 'react'

interface CardDateInputsProps {
  mode: 'single' | 'range'
  selectedDate: Date | null
  selectedRange: DateRange
  onModeChange: (newMode: 'single' | 'range') => void
  onRangeUpdate: (range: DateRange) => void
  onSingleDateUpdate: (date: Date | null) => void
  singleDateType: 'start' | 'end'
  onSingleDateTypeChange: (type: 'start' | 'end') => void
}

function CardDateInputs({
  selectedRange,
  mode,
  onModeChange,
  onRangeUpdate,
  onSingleDateUpdate,
  selectedDate,
  singleDateType,
  onSingleDateTypeChange
}: CardDateInputsProps) {
  const [startDateInput, setStartDateInput] = useState<string>(
    selectedRange.start ? calendarUtils.formatDateForInput(selectedRange.start) : ''
  )
  const [endDateInput, setEndDateInput] = useState<string>(
    selectedRange.end ? calendarUtils.formatDateForInput(selectedRange.end) : ''
  )
  const [dueTimeInput, setDueTimeInput] = useState<string>(
    selectedRange.end ? calendarUtils.formatTimeForInput(selectedRange.end) : '12:00 PM'
  )

  const [hasStartDate, setHasStartDate] = useState<boolean>(!!selectedRange.start)
  const [hasEndDate, setHasEndDate] = useState<boolean>(!!selectedRange.end)

  // Sync input values với selectedRange khi có thay đổi
  useEffect(() => {
    if (!selectedRange?.start || !selectedRange?.end) {
      return
    }

    setStartDateInput(selectedRange.start ? calendarUtils.formatDateForInput(selectedRange.start) : '')
    setEndDateInput(selectedRange.end ? calendarUtils.formatDateForInput(selectedRange.end) : '')
    setDueTimeInput(selectedRange.end ? calendarUtils.formatTimeForInput(selectedRange.end) : '12:00 PM')
    setHasStartDate(!!selectedRange.start)
    setHasEndDate(!!selectedRange.end)
  }, [selectedRange])

  // Sync input values với selectedDate khi có thay đổi
  useEffect(() => {
    if (!selectedDate || mode === 'range') return

    // Handle for single mode
    if (singleDateType === 'start') {
      setStartDateInput(calendarUtils.formatDateForInput(selectedDate))
      setHasStartDate(!!selectedDate)
    } else {
      setEndDateInput(calendarUtils.formatDateForInput(selectedDate))
      setHasEndDate(!!selectedDate)
    }
  }, [selectedDate])

  const handleStartDateBlur = (value: string): void => {
    setStartDateInput(value)

    if (hasStartDate) {
      const parsedDate = calendarUtils.parseDateFromInput(value)

      if (mode === 'single' && singleDateType === 'start') {
        // Mode single với startDate
        onSingleDateUpdate(parsedDate)
      } else if (mode === 'range') {
        // Mode range
        const newRange = { ...selectedRange, start: parsedDate }
        onRangeUpdate(newRange)
      }
    }
  }

  const handleEndDateBlur = (value: string): void => {
    setEndDateInput(value)

    if (hasEndDate) {
      const parsedDate = calendarUtils.parseDateFromInput(value)

      if (mode === 'single' && singleDateType === 'end') {
        // Mode single với endDate
        onSingleDateUpdate(parsedDate)
      } else if (mode === 'range') {
        // Mode range
        const newRange = { ...selectedRange, end: parsedDate }
        onRangeUpdate(newRange)
      }
    }
  }

  const handleDueTimeBlur = (value: string): void => {
    setDueTimeInput(value)

    if (hasEndDate) {
      const parsedDate = calendarUtils.parseDateFromInput(endDateInput, value)

      if (parsedDate) {
        setEndDateInput(calendarUtils.formatDateForInput(parsedDate))

        if (mode === 'single' && singleDateType === 'end') {
          // Mode single với endDate
          onSingleDateUpdate(parsedDate)
        } else if (mode === 'range') {
          // Mode range
          const newRange = { ...selectedRange, end: parsedDate }
          onRangeUpdate(newRange)
        }
      }
    }
  }

  const handleStartDateCheckbox = (checked: boolean): void => {
    setHasStartDate(checked)

    if (checked) {
      // Bật start date
      const parsedDate = calendarUtils.parseDateFromInput(startDateInput) || new Date()

      if (hasEndDate) {
        // Có cả start và end -> chuyển sang range mode
        onModeChange('range')
        const newRange = { ...selectedRange, start: parsedDate }
        onRangeUpdate(newRange)
      } else {
        // Chỉ có start -> single mode với startDate
        onModeChange('single')
        onSingleDateTypeChange('start')
        onSingleDateUpdate(parsedDate)
      }
    } else {
      // Tắt start date
      if (hasEndDate) {
        // Còn lại end date -> single mode với endDate
        onModeChange('single')
        onSingleDateTypeChange('end')
        const newRange = { ...selectedRange, start: null }
        onRangeUpdate(newRange)
      } else {
        // Không còn date nào -> single mode với null
        onModeChange('single')
        onSingleDateUpdate(null)
        const newRange = { ...selectedRange, start: null }
        onRangeUpdate(newRange)
      }

      setStartDateInput('')
      setHasStartDate(false)
    }
  }

  const handleEndDateCheckbox = (checked: boolean): void => {
    setHasEndDate(checked)

    if (checked) {
      // Bật end date
      const parsedDate = calendarUtils.parseDateFromInput(endDateInput) || new Date()

      if (hasStartDate) {
        // Có cả start và end -> chuyển sang range mode
        onModeChange('range')
        const newRange = { ...selectedRange, end: parsedDate }
        onRangeUpdate(newRange)
      } else {
        // Chỉ có end -> single mode với endDate
        onModeChange('single')
        onSingleDateTypeChange('end')
        onSingleDateUpdate(parsedDate)
      }
    } else {
      // Tắt end date
      if (hasStartDate) {
        // Còn lại start date -> single mode với startDate
        onModeChange('single')
        onSingleDateTypeChange('start')
        const newRange = { ...selectedRange, end: null }
        onRangeUpdate(newRange)
      } else {
        // Không còn date nào -> single mode với null
        onModeChange('single')
        onSingleDateUpdate(null)
        const newRange = { ...selectedRange, end: null }
        onRangeUpdate(newRange)
      }

      setEndDateInput('')
      setHasEndDate(false)
    }
  }

  return (
    <div className='space-y-4 border-t border-gray-200 p-4'>
      <div>
        <label className='mb-1 block text-sm font-medium text-gray-700'>
          Start date
          {mode === 'single' && singleDateType === 'start' && (
            <span className='ml-2 text-xs text-blue-600'>(Active)</span>
          )}
        </label>
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={hasStartDate}
            onChange={(e) => handleStartDateCheckbox(e.target.checked)}
            className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
          />
          <input
            type='text'
            value={startDateInput}
            onChange={(e) => setStartDateInput(e.target.value)}
            onBlur={(e) => handleStartDateBlur(e.target.value)}
            placeholder='M/D/YYYY'
            disabled={!hasStartDate}
            className={`w-28 rounded-md border px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasStartDate ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-400'
            } ${mode === 'single' && singleDateType === 'start' && hasStartDate ? 'ring-2 ring-blue-300' : ''}`}
          />
        </div>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-gray-700'>Due date</label>
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={hasEndDate}
            onChange={(e) => handleEndDateCheckbox(e.target.checked)}
            className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
          />
          <input
            type='text'
            value={endDateInput}
            onChange={(e) => setEndDateInput(e.target.value)}
            onBlur={(e) => handleEndDateBlur(e.target.value)}
            placeholder='M/D/YYYY'
            disabled={!hasEndDate}
            className={`w-28 rounded-md border px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasEndDate ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-400'
            } ${mode === 'single' && singleDateType === 'end' && hasEndDate ? 'ring-2 ring-blue-300' : ''}`}
          />
          <input
            type='text'
            value={dueTimeInput}
            onChange={(e) => setDueTimeInput(e.target.value)}
            onBlur={(e) => handleDueTimeBlur(e.target.value)}
            placeholder='12:00 PM'
            disabled={!hasEndDate}
            className={`w-24 rounded-md border px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasEndDate ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-400'
            } ${mode === 'single' && singleDateType === 'end' && hasEndDate ? 'ring-2 ring-blue-300' : ''}`}
          />
        </div>
      </div>
    </div>
  )
}

export default CardDateInputs
