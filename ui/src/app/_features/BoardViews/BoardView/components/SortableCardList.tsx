import React from 'react'
import CardList from './CardList'
import { useSortable } from '@dnd-kit/sortable'
import { cardListTypes } from '@/entities/cardList'

interface Props {
  cardListData: cardListTypes.CardList
}

function SortableCardList({ cardListData }: Props) {
  const { id } = cardListData

  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef
  } = useSortable({
    id
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
    />
  )
}

export default SortableCardList
