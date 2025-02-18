import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useCardListsByBoards } from '@/app/_hooks/query/useCardListsByBoard'
import { closestCenter, DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CardList from './components/CardList'
import CardListAddButton from './components/CardListAddButton'
import type { CardLists } from '@/entities/cardList/cardList.types'
import type { DragEndEvent } from '@dnd-kit/core'

function BoardView() {
  const { boardId } = useParams()
  const sensors = useSensors(useSensor(PointerSensor))

  const { data: cardLists = [] } = useCardListsByBoards(boardId as string)
  const [lists, setLists] = useState<CardLists>(cardLists)

  useEffect(() => {
    setLists(cardLists)
  }, [cardLists])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    console.log('ACTIVE: ', active)
    console.log('OVER: ', over)
  }

  return (
    <div className='flex size-full max-w-full gap-3 overflow-x-scroll p-2'>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
        <SortableContext items={cardLists} strategy={horizontalListSortingStrategy}>
          {cardLists?.map((cardList) => (
            <CardList
              key={cardList.id}
              id={cardList.id}
              name={cardList.name}
              boardId={cardList.boardId}
            />
          ))}
        </SortableContext>
      </DndContext>
      <CardListAddButton />
    </div>
  )
}

export default BoardView
