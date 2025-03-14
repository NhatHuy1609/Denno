import React from 'react'
import { cardTypes } from '@/entities/card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CardItem from './CardItem'

interface Props {
  cardData: cardTypes.Card
}

function SortableCardItem({ cardData }: Props) {
  const { id } = cardData

  const { setNodeRef, listeners, isDragging, isSorting, over, overIndex, transform, transition } =
    useSortable({
      id,
      data: {
        cardData
      }
    })

  return (
    <CardItem
      cardData={cardData}
      transform={transform}
      transition={transition}
      dragging={isDragging}
      ref={setNodeRef}
      {...listeners}
    />
  )
}

export default SortableCardItem
