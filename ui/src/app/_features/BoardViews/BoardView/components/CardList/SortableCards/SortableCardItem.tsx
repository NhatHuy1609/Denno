import React from 'react'
import { cardTypes } from '@/entities/card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  cardData: cardTypes.Card
}

function SortableCardItem({ cardData }: Props) {
  const { id, name } = cardData

  const { setNodeRef, listeners, isDragging, isSorting, over, overIndex, transform, transition } =
    useSortable({
      id
    })

  const style: React.CSSProperties = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition: transition ?? undefined,
    padding: '4px',
    border: '1px solid blue'
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      style={style}
      className='h-[60px] w-full border border-blue-500'
    >
      {name}
    </div>
  )
}

export default SortableCardItem
