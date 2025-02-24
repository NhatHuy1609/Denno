import React, { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'next/navigation'
import { useCardListsByBoards } from '@/app/_hooks/query/useCardListsByBoard'
import {
  closestCenter,
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  UniqueIdentifier,
  DragOverlay,
  DragEndEvent,
  DropAnimation,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import type { CardLists } from '@/entities/cardList/cardList.types'
import CardList from './CardList'
import SortableCardList from './SortableCardList'
import CardListAddButton from './CardListAddButton'

interface Props {
  cardLists: CardLists
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
}

function SortableCardLists({ cardLists }: Props) {
  const [lists, setLists] = useState<CardLists>(cardLists)
  // Active Dragging CardList
  const [activeId, setActiveId] = useState<null | string>(null)

  const sensors = useSensors(useSensor(PointerSensor))

  const listIds = useMemo(() => lists.map((cardList) => cardList.id), [lists])

  useEffect(() => {
    setLists(cardLists)
  }, [cardLists])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active && over && active.id !== over.id) {
      setLists((items) => {
        const oldItems = [...items]
        const activeIndex = oldItems.findIndex((list) => list.id === active?.id)
        const overIndex = oldItems.findIndex((list) => list.id === over?.id)

        return arrayMove(oldItems, activeIndex, overIndex)
      })

      setActiveId(null)
    }
  }

  const draggingCardList = lists.find((cardList) => cardList.id === activeId)

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <div className='absolute inset-0 overflow-x-auto'>
        <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
          <ul className='flex max-w-fit list-none gap-2 p-2'>
            {lists?.map((cardList) => (
              <li key={cardList.id}>
                <SortableCardList id={cardList.id} name={cardList.name} />
              </li>
            ))}
            <CardListAddButton />
          </ul>
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId !== null ? <CardList id={activeId} name={draggingCardList?.name} /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  )
}

export default SortableCardLists
