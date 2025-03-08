import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
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
  defaultDropAnimationSideEffects,
  UniqueIdentifier,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  DragOverEvent,
  MeasuringStrategy
} from '@dnd-kit/core'
// import { PointerSensor, MouseSensor } from '@/lib/dnd-kit/custom-sensors'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import type { CardLists } from '@/entities/cardList/cardList.types'
import CardList from './CardList'
import SortableCardList from './SortableCardList'
import CardListAddButton from './CardListAddButton'
import { cardListTypesDto } from '@/service/api/cardList'
import { useQueryClient } from '@tanstack/react-query'
import { CardListQueries, cardListTypes } from '@/entities/cardList'
import { useParams } from 'next/navigation'
import { toastError } from '@/ui'
import { cardTypes } from '@/entities/card'
import SortableCardItem from './CardList/SortableCards/SortableCardItem'
import CardItem from './CardList/CardItem'

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

// Transform cardlists array to a data structure like Map to handle drag and drop
type TransformedItems = Record<UniqueIdentifier, UniqueIdentifier[]>

const transformCardListsToItems = (data: cardListTypes.CardLists) => {
  return data.reduce<TransformedItems>((acc, cardList) => {
    const cardListKey = cardList.id as UniqueIdentifier
    acc[cardListKey] = [...cardList.cards].map((c) => c.id as UniqueIdentifier)
    return acc
  }, {})
}

const transformCardListsToMap = (data: cardListTypes.CardLists) => {
  const cardListsMap: Record<string, cardListTypes.CardList> = {}
  const cardsMap: Record<string, cardTypes.Card> = {}

  data.forEach((cardList) => {
    const cardListId = cardList.id
    const cards = cardList.cards

    cardListsMap[cardListId] = { ...cardList }

    cards.forEach((card) => {
      const cardId = card.id
      cardsMap[cardId] = { ...card }
    })
  })

  return { cardListsMap, cardsMap }
}

function SortableCardLists({ cardLists }: Props) {
  /**
   * Transforms an array of card lists into two lookup maps:
   * - `cardListsMap`: Maps card list IDs to their corresponding card list objects.
   * - `cardsMap`: Maps card IDs to their corresponding card objects.
   *
   * This structure improves data access performance.
   */
  const { cardListsMap, cardsMap } = useMemo(() => {
    return transformCardListsToMap(cardLists)
  }, [cardLists])

  const { boardId } = useParams()
  const queryClient = useQueryClient()
  // For handling drag and drop with dndkit
  const [lists, setLists] = useState<ReturnType<typeof transformCardListsToItems>>(() => {
    return transformCardListsToItems(cardLists)
  })
  // CardList containers
  const [containers, setContainers] = useState(() => Object.keys(lists) as UniqueIdentifier[])
  // For drag and drop of dnd-kit logic
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  const isSortingContainer = activeId != null ? containers.includes(activeId) : false

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

  // Adding sensors
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 80,
      tolerance: 50
    }
  })
  const sensors = useSensors(pointerSensor)
  // ##########################################################################
  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in lists) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => container.id in lists)
        })
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (overId in lists) {
          const containerItems = lists[overId]

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) => container.id !== overId && containerItems.includes(container.id)
              )
            })[0]?.id
          }
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, lists]
  )
  const [clonedLists, setClonedLists] = useState<TransformedItems | null>(null)

  const findContainer = (id: UniqueIdentifier) => {
    if (id in lists) {
      return id
    }

    return Object.keys(lists).find((key) => lists[key].includes(id))
  }

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id)

    if (!container) {
      return -1
    }

    const index = lists[container].indexOf(id)

    return index
  }

  const onDragCancel = () => {
    if (clonedLists) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setLists(clonedLists)
    }

    setActiveId(null)
    setClonedLists(null)
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [lists])

  // useEffect(() => {
  //   setLists(cardLists)
  // }, [cardLists])

  // const handleDragStart = (event: DragStartEvent) => {
  //   const { active } = event
  //   setActiveId(active.id as string)
  // }

  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event

  //   if (active && over && active.id !== over.id) {
  //     const overId = over.id as string
  //     const activeId = active.id as string
  //     const overIndex = lists.findIndex((list) => list.id === overId)
  //     const activeIndex = lists.findIndex((list) => list.id === activeId)

  //     setLists((items) => {
  //       const oldItems = [...items]
  //       return arrayMove(oldItems, activeIndex, overIndex)
  //     })

  //     // Calling to API to update in background
  //     let updateCardListRankDto: cardListTypesDto.UpdateCardListRankDto = {
  //       previousRank: null,
  //       nextRank: null
  //     }

  //     if (activeIndex > overIndex) {
  //       updateCardListRankDto = {
  //         nextRank: lists[overIndex].rank,
  //         previousRank: lists[overIndex - 1]?.rank ?? null
  //       }
  //     } else {
  //       updateCardListRankDto = {
  //         nextRank: lists[overIndex + 1]?.rank ?? null,
  //         previousRank: lists[overIndex]?.rank
  //       }
  //     }

  //     updateCardListRank({
  //       id: activeId,
  //       updateCardListRankDto
  //     })
  //   }

  //   setActiveId(null)
  // }

  // // Active dragging cardlist
  // const draggingCardList = lists.find((cardList) => cardList.id === activeId)

  const onDragStart = ({ active }: DragStartEvent) => {
    console.log(active)
    setActiveId(active.id)
    setClonedLists(lists)
  }

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id

    if (overId == null || active.id in lists) {
      return
    }

    const overContainer = findContainer(overId)
    const activeContainer = findContainer(active.id)

    if (!overContainer || !activeContainer) {
      return
    }

    if (activeContainer !== overContainer) {
      setLists((lists) => {
        const activeItems = lists[activeContainer]
        const overItems = lists[activeContainer]
        const overIndex = overItems.indexOf(overId)
        const activeIndex = activeItems.indexOf(active.id)

        let newIndex: number

        if (overId in lists) {
          newIndex = overItems.length + 1
        } else {
          const isBelowOverItems =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height

          const modifier = isBelowOverItems ? 1 : 0

          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
        }

        recentlyMovedToNewContainer.current = true

        return {
          ...lists,
          [activeContainer]: lists[activeContainer].filter((item) => item !== active.id),
          [overContainer]: [
            ...lists[overContainer].slice(0, newIndex),
            lists[activeContainer][activeIndex],
            ...lists[overContainer].slice(newIndex, lists[overContainer].length)
          ]
        }
      })
    }
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id in lists && over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id)
        const overIndex = containers.indexOf(over.id)

        return arrayMove(containers, activeIndex, overIndex)
      })
    }

    const activeContainer = findContainer(active.id)

    if (!activeContainer) {
      setActiveId(null)
      return
    }

    const overId = over?.id

    if (overId == null) {
      setActiveId(null)
      return
    }

    const overContainer = findContainer(overId)

    if (overContainer) {
      const activeIndex = lists[activeContainer].indexOf(active.id)
      const overIndex = lists[overContainer].indexOf(overId)

      if (activeIndex !== overIndex) {
        setLists((lists) => ({
          ...lists,
          [overContainer]: arrayMove(lists[overContainer], activeIndex, overIndex)
        }))
      }
    }

    setActiveId(null)
  }

  const renderContainerDragOverlay = (containerId: UniqueIdentifier) => {
    return (
      <CardList cardListData={cardListsMap[containerId]}>
        {lists[containerId].map((cardId) => (
          <CardItem key={cardId} cardData={cardsMap[cardId]} />
        ))}
      </CardList>
    )
  }

  const renderCardItemDragOverlay = (cardId: UniqueIdentifier) => {
    return <CardItem cardData={cardsMap[cardId]} />
  }

  return (
    <DndContext
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <div className='absolute inset-0 overflow-x-auto'>
        <SortableContext items={containers} strategy={horizontalListSortingStrategy}>
          <div className='flex max-w-fit list-none gap-2 p-2'>
            {containers?.map((containerId) => (
              <SortableCardList key={containerId} cardListData={cardListsMap[containerId]}>
                <SortableContext items={lists[containerId]} strategy={verticalListSortingStrategy}>
                  {lists[containerId].map((cardId) => (
                    <SortableCardItem key={cardId} cardData={cardsMap[cardId]} />
                  ))}
                </SortableContext>
              </SortableCardList>
            ))}
            <CardListAddButton />
          </div>
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId)
              : renderCardItemDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  )
}

export default SortableCardLists
