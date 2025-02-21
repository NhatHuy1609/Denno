import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useCardListsByBoards } from '@/app/_hooks/query/useCardListsByBoard'
import {
  closestCenter,
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CardList from './components/CardList'
import CardListAddButton from './components/CardListAddButton'
import type { CardLists } from '@/entities/cardList/cardList.types'
import { arrayMove } from '@dnd-kit/sortable'
import {
  UniqueIdentifier,
  DragOverlay,
  DragEndEvent,
  DropAnimation,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { createPortal } from 'react-dom'

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
}

function BoardView() {
  const { boardId } = useParams()

  const { data: cardLists = [] } = useCardListsByBoards(boardId as string)
  const [lists, setLists] = useState<CardLists>(cardLists)
  const sensors = useSensors(useSensor(PointerSensor))

  // Active Dragging CardList
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const listIds = useMemo(() => lists.map((cardList) => cardList.id), [lists])

  useEffect(() => {
    setLists(cardLists)
  }, [cardLists])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id)
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

  return (
    <div className='flex size-full max-w-full gap-3 overflow-x-scroll p-2'>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <div className='flex w-full'>
          <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
            <div className='flex w-full gap-2'>
              {lists?.map((cardList, index) => (
                <CardList
                  key={cardList.id}
                  // key={index}
                  id={cardList.id}
                  name={cardList.name}
                  boardId={cardList.boardId}
                />
              ))}
            </div>
          </SortableContext>
        </div>
        {/* {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId !== null ? (
              <div className='h-[80px] w-[272px] bg-white opacity-80'></div>
            ) : null}
          </DragOverlay>,
          document.body
        )} */}
      </DndContext>
      <CardListAddButton />
    </div>
  )
}

export default BoardView
