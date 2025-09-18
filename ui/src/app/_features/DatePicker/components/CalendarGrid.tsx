import { DateRange } from '../types'
import { calendarUtils } from '../utils'
import CalendarDayButton from './CalendarDayButton'
import CalendarDaysHeader from './CalendarDaysHeader'

type Props = {
  currentDate: Date
  selectedDate: number | null
  selectedRange: DateRange
  mode: 'single' | 'range'
  rangeSelectionStep: 'start' | 'end'
  onDateSelect: (day: number, monthOffset?: number) => void
  onClearRange: () => void
}

function CalendarGrid({
  currentDate,
  selectedDate,
  selectedRange,
  mode,
  rangeSelectionStep,
  onDateSelect,
  onClearRange
}: Props) {
  const renderCalendarDays = (): JSX.Element[] => {
    const daysInMonth = calendarUtils.getDaysInMonth(currentDate)
    const firstDay = calendarUtils.getFirstDayOfMonth(currentDate)
    const prevMonthDays = calendarUtils.getPreviousMonthDays(currentDate)

    const days: JSX.Element[] = []

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day)

      days.push(
        <CalendarDayButton
          key={`prev-${day}`}
          day={day}
          date={date}
          isSelected={false}
          isCurrentMonth={false}
          isRangeStart={mode === 'range' && calendarUtils.isDateRangeStart(date, selectedRange)}
          isRangeEnd={mode === 'range' && calendarUtils.isDateRangeEnd(date, selectedRange)}
          isInRange={mode === 'range' && calendarUtils.isDateInRange(date, selectedRange)}
          onClick={() => onDateSelect(day, -1)}
        />
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

      days.push(
        <CalendarDayButton
          key={day}
          day={day}
          date={date}
          isSelected={isSelected}
          isCurrentMonth={true}
          isRangeStart={mode === 'range' && calendarUtils.isDateRangeStart(date, selectedRange)}
          isRangeEnd={mode === 'range' && calendarUtils.isDateRangeEnd(date, selectedRange)}
          isInRange={mode === 'range' && calendarUtils.isDateInRange(date, selectedRange)}
          onClick={() => onDateSelect(day)}
        />
      )
    }

    // Next month's leading days to fill the grid
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const remainingCells = totalCells - (firstDay + daysInMonth)

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
      days.push(
        <CalendarDayButton
          key={`next-${day}`}
          day={day}
          date={date}
          isSelected={false}
          isCurrentMonth={false}
          isRangeStart={mode === 'range' && calendarUtils.isDateRangeStart(date, selectedRange)}
          isRangeEnd={mode === 'range' && calendarUtils.isDateRangeEnd(date, selectedRange)}
          isInRange={mode === 'range' && calendarUtils.isDateInRange(date, selectedRange)}
          onClick={() => onDateSelect(day, 1)}
        />
      )
    }

    return days
  }

  return (
    <div className='w-auto'>
      <CalendarDaysHeader />
      <div className='grid grid-cols-7'>{renderCalendarDays()}</div>
    </div>
  )
}

export default CalendarGrid
