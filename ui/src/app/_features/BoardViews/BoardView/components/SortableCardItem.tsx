import React from 'react'
import { cardSchemas } from '@/entities/card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CardItem from './CardItem'

interface Props {
  cardData: cardSchemas.Card
}

function SortableCardItem({ cardData }: Props) {
  const { id } = cardData

  const { setNodeRef, listeners, isDragging, isSorting, over, overIndex, transform, transition } = useSortable({
    id,
    data: {
      cardData
    }
  })

  const style: React.CSSProperties = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition: transition ?? undefined,
    opacity: isDragging ? '0.5' : '1'
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners}>
      <CardItem cardData={cardData} isDragging={isDragging} />
    </div>
  )
}

export default SortableCardItem
