import { useEffect, useState } from 'react'
import { DateRange } from '../types'

export const useDatePicker = (
  initialDate: Date | null,
  initialDateRange: DateRange,
  mode: 'single' | 'range',
  onDateSelect?: (date: Date) => void,
  onDateRangeSelect?: (range: DateRange) => void
) => {
  // Sử dụng initialDate nếu có, nếu không thì sử dụng ngày hiện tại để điều hướng
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date())

  // Chỉ set selectedDate nếu là mode 'single' và initialDate không null
  const [selectedDate, setSelectedDate] = useState<number | null>(
    mode === 'single' && initialDate ? initialDate.getDate() : null
  )

  const [selectedRange, setSelectedRange] = useState<DateRange>(initialDateRange)
  const [rangeSelectionStep, setRangeSelectionStep] = useState<'start' | 'end'>('start')

  useEffect(() => {
    if (initialDate) {
      setCurrentDate(initialDate)
      setSelectedDate(initialDate.getDate())
    } else {
      setCurrentDate(new Date())
      setSelectedDate(null)
    }
  }, [initialDate])

  useEffect(() => {
    setSelectedRange(initialDateRange)
  }, [initialDateRange])

  const navigateMonth = (direction: number): void => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const navigateYear = (direction: number): void => {
    const newDate = new Date(currentDate)
    newDate.setFullYear(currentDate.getFullYear() + direction)
    setCurrentDate(newDate)
  }

  const handleDateSelect = (day: number, monthOffset: number = 0): void => {
    let targetDate = new Date(currentDate)

    if (monthOffset !== 0) {
      targetDate.setMonth(currentDate.getMonth() + monthOffset)
      navigateMonth(monthOffset)
    }

    targetDate.setDate(day)
    if (mode === 'single') {
      setSelectedDate(day)
      onDateSelect?.(targetDate)
    } else {
      // Range mode
      if (rangeSelectionStep === 'start' || !selectedRange.start) {
        // Starting new range selection
        const newRange = { start: targetDate, end: null }
        setSelectedRange(newRange)
        setRangeSelectionStep('end')
      } else {
        // Selecting end date
        let startDate = selectedRange.start
        let endDate = targetDate

        // Auto-swap if end date is before start date
        if (endDate < startDate) {
          ;[startDate, endDate] = [endDate, startDate]
        }

        const newRange = { start: startDate, end: endDate }
        setSelectedRange(newRange)
        setRangeSelectionStep('start')
        onDateRangeSelect?.(newRange)
      }
    }
  }

  const resetRange = (): void => {
    setSelectedRange({ start: null, end: null })
    setRangeSelectionStep('start')
  }

  const setRangeFromState = (newRange: DateRange): void => {
    setSelectedRange(newRange)
    setRangeSelectionStep('start')
  }

  return {
    currentDate,
    selectedDate,
    selectedRange,
    navigateMonth,
    navigateYear,
    handleDateSelect,
    resetRange,
    setRangeFromState
  }
}
