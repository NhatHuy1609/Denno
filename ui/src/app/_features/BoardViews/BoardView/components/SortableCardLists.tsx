import React, { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import useUpdateCardListRankMutation from '../mutations/updateCardListRank.mutation'
import {
  closestCenter,
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  DragStartEvent,
  DragOverlay,
  DragEndEvent,
  DropAnimation,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
// import { PointerSensor, MouseSensor } from '@/lib/dnd-kit/custom-sensors'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import type { CardLists } from '@/entities/cardList/cardList.types'
import CardList from './CardList'
import SortableCardList from './SortableCardList'
import CardListAddButton from './CardListAddButton'
import { cardListTypesDto } from '@/service/api/cardList'
import { useQueryClient } from '@tanstack/react-query'
import { CardListQueries } from '@/entities/cardList'
import { useParams } from 'next/navigation'
import { toastError } from '@/ui'

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
  const { boardId } = useParams()
  const queryClient = useQueryClient()

  // For updating cardlists on client screen
  const [lists, setLists] = useState<CardLists>(cardLists)
  const listIds = useMemo(() => lists.map((cardList) => cardList.id), [lists])

  // Active Dragging CardList
  const [activeId, setActiveId] = useState<null | string>(null)

  // Adding sensors
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 80,
      tolerance: 50
    }
  })
  const sensors = useSensors(pointerSensor)

  const { mutate: updateCardListRank } = useUpdateCardListRankMutation({
    onMutate() {
      const previousCardLists = queryClient.getQueryData(
        CardListQueries.cardListsByBoardQuery(boardId as string).queryKey
      )
      return { previousCardLists }
    },
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: CardListQueries.cardListsByBoardQuery(boardId as string).queryKey
      })
    },
    onError(error, variables, context) {
      queryClient.setQueryData(
        CardListQueries.cardListsByBoardQuery(boardId as string).queryKey,
        context.previousCardLists
      )
      setLists(context.previousCardLists)
      toastError("Failed to update card list's rank")
    }
  })

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
      const overId = over.id as string
      const activeId = active.id as string
      const overIndex = lists.findIndex((list) => list.id === overId)
      const activeIndex = lists.findIndex((list) => list.id === activeId)

      setLists((items) => {
        const oldItems = [...items]
        return arrayMove(oldItems, activeIndex, overIndex)
      })

      // Calling to API to update in background
      let updateCardListRankDto: cardListTypesDto.UpdateCardListRankDto = {
        previousRank: null,
        nextRank: null
      }

      if (activeIndex > overIndex) {
        updateCardListRankDto = {
          nextRank: lists[overIndex].rank,
          previousRank: lists[overIndex - 1]?.rank ?? null
        }
      } else {
        updateCardListRankDto = {
          nextRank: lists[overIndex + 1]?.rank ?? null,
          previousRank: lists[overIndex]?.rank
        }
      }

      updateCardListRank({
        id: activeId,
        updateCardListRankDto
      })
    }

    setActiveId(null)
  }

  // Active dragging cardlist
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
