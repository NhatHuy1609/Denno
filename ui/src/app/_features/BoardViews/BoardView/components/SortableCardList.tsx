import React from 'react'
import CardList from './CardList'
import { useSortable } from '@dnd-kit/sortable'
import { cardListSchemas } from '@/entities/cardList'

interface Props {
  cardListData: cardListSchemas.CardList
  children: React.ReactNode
}

function SortableCardList({ cardListData, children }: Props) {
  const { id } = cardListData

  const { isDragging, attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } = useSortable({
    id,
    data: {
      cardListData
    }
  })

  return (
    <CardList
      cardListData={cardListData}
      ref={setNodeRef}
      listeners={listeners}
      transform={transform}
      transition={transition}
      dragging={isDragging}
      setActivatorNodeRef={setActivatorNodeRef}
      {...attributes}
    >
      {children}
    </CardList>
  )
}

export default SortableCardList
