import { DAYS_OF_WEEK } from '../constants'

function CalendarDaysHeader() {
  return (
    <div className='my-1 grid grid-cols-7 gap-1'>
      {DAYS_OF_WEEK.map((day: string) => (
        <div key={day} className='py-2 text-center text-sm font-medium text-gray-500'>
          {day}
        </div>
      ))}
    </div>
  )
}

export default CalendarDaysHeader
