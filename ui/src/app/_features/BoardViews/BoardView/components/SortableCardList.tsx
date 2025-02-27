import React, { useState } from 'react'
import CardList from './CardList'
import { useSortable } from '@dnd-kit/sortable'

interface Props {
  id: string
  name: string
}

function SortableCardList({ id, name }: Props) {
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
      id={id}
      name={name}
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
