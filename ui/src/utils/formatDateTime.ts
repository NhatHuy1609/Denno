import { format, parseISO, isValid } from 'date-fns'

export const formatDateTime = (datetime: string) => {
  const date = parseISO(datetime)
  return isValid(date) ? format(date, 'MMMM do, yyyy h:mm a') : ''
}

export function formatDateRange(startUtc?: string | null, endUtc?: string | null): string {
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' })
  const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric' })
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  if (startUtc && !endUtc) {
    const start = new Date(startUtc)
    return `Started: ${monthFormatter.format(start)} ${dayFormatter.format(start)}, ${timeFormatter.format(start)}`
  }

  if (!startUtc && endUtc) {
    const end = new Date(endUtc)
    return `Due: ${monthFormatter.format(end)} ${dayFormatter.format(end)}, ${timeFormatter.format(end)}`
  }

  if (startUtc && endUtc) {
    const start = new Date(startUtc)
    const end = new Date(endUtc)

    const startMonth = monthFormatter.format(start)
    const startDay = dayFormatter.format(start)
    const endMonth = monthFormatter.format(end)
    const endDay = dayFormatter.format(end)
    const time = timeFormatter.format(end)

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${time}`
    }

    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${time}`
  }

  return ''
}
