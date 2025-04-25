import { format, parseISO, isValid } from 'date-fns'

export const formatDateTime = (datetime: string) => {
  const date = parseISO(datetime)
  return isValid(date) ? format(date, "MMMM do, yyyy h:mm a") : ''
}