import React from 'react'
import { formatDateRange } from '@/utils/formatDateTime'
import { cardSchemas } from '@/entities/card'
import { cn } from '@/lib/styles/utils'

function CardDetailsInfoRow({ cardData }: { cardData: cardSchemas.Card }) {
  const { startDate, dueDate, isCompleted, isOverdue } = cardData

  const hasDates = startDate || dueDate

  const formattedCardDates = formatDateRange(startDate, dueDate)

  return (
    <div className='w-full'>
      {hasDates && (
        <button
          type='button'
          className={cn('flex size-fit cursor-pointer items-center gap-2 rounded bg-gray-200 p-1 hover:bg-gray-300', {
            'bg-red-100 hover:bg-red-200': !isCompleted && isOverdue,
            'bg-green-100 hover:bg-green-200': isCompleted
          })}
        >
          <span
            className={cn('text-xs text-black', {
              'text-red-500': !isCompleted && isOverdue,
              'text-green-500': isCompleted
            })}
          >
            {formattedCardDates}
          </span>
        </button>
      )}
    </div>
  )
}

export default CardDetailsInfoRow
