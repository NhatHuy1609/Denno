import { DateRange } from './types'

export const calendarUtils = {
  getDaysInMonth: (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  },

  getFirstDayOfMonth: (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  },

  getPreviousMonthDays: (date: Date): number => {
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 0)
    return prevMonth.getDate()
  },
  isSameDay: (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString()
  },

  isDateInRange: (date: Date, range: DateRange): boolean => {
    if (!range.start || !range.end) return false
    return date >= range.start && date <= range.end
  },

  isDateRangeStart: (date: Date, range: DateRange): boolean => {
    return range.start ? calendarUtils.isSameDay(date, range.start) : false
  },

  isDateRangeEnd: (date: Date, range: DateRange): boolean => {
    return range.end ? calendarUtils.isSameDay(date, range.end) : false
  },

  formatDateForInput: (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  },

  formatTimeForInput: (date: Date): string => {
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${hours}:${minutes} ${ampm}`
  },

  parseDateFromInput: (dateStr: string, timeStr?: string): Date | null => {
    try {
      // Handle MM/DD/YYYY format
      const parts = dateStr.split('/')
      if (parts.length !== 3) return null

      const month = parseInt(parts[0]) - 1 // Month is 0-indexed
      const day = parseInt(parts[1])
      const year = parseInt(parts[2])

      if (isNaN(month) || isNaN(day) || isNaN(year)) return null

      let hour = 0
      let minute = 0
      if (timeStr) {
        // Parse h:mm a
        const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
        if (!timeMatch) return null

        hour = parseInt(timeMatch[1])
        minute = parseInt(timeMatch[2])
        const meridian = timeMatch[3].toUpperCase()

        if (meridian === 'PM' && hour !== 12) {
          hour += 12
        } else if (meridian === 'AM' && hour === 12) {
          hour = 0
        }
      }

      const localDate = new Date(year, month, day, hour, minute)
      return localDate
    } catch {
      return null
    }
  }
}
