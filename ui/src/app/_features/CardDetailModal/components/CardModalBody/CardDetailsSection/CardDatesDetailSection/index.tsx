import React from 'react'
import { useCardDetailModalContext } from '@/app/_features/CardDetailModal/context'
import DetailSectionWrapper from '../DetailSectionWrapper'
import CardPopoverActionWrapper from '../CardPopoverActionWrapper'
import CardDatesActionPanel from '../../CardActionPanels/CardDatesActionPanel'
import { formatDateRange } from '@/utils/formatDateTime'

function CardDatesDetailSection() {
  const { cardData } = useCardDetailModalContext()
  const { startDate, dueDate, isOverDue, isCompleted } = cardData || {}

  if (!startDate && !dueDate) {
    return null
  }

  const formattedCardDates = formatDateRange(startDate, dueDate)

  return (
    <DetailSectionWrapper label='Dates'>
      <CardPopoverActionWrapper
        renderTrigger={() => (
          <button
            type='button'
            className='flex size-fit cursor-pointer items-center gap-2 rounded bg-gray-200 p-2 hover:bg-gray-300'
          >
            <span className='text-sm font-semibold text-black'>{formattedCardDates}</span>
            {isCompleted && <span className='rounded bg-green-500 px-2 py-1 text-white'>Completed</span>}
            {!isCompleted && isOverDue && <span className='rounded bg-red-300 px-2 py-1 text-white'>Overdue</span>}
          </button>
        )}
        renderContent={(closeFn) => <CardDatesActionPanel onClosePanel={closeFn} />}
        contentConfigs={{
          side: 'right',
          avoidCollisions: true
        }}
        contentClassName='w-fit'
      />
    </DetailSectionWrapper>
  )
}

export default CardDatesDetailSection
