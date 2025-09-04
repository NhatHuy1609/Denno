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
import CardList from './CardList'
import SortableCardList from './SortableCardList'
import CardListAddButton from './CardListAddButton'
import { cardListTypesDto } from '@/service/api/cardList'
import { useQueryClient } from '@tanstack/react-query'
import { CardListQueries, cardListSchemas } from '@/entities/cardList'
import { useParams } from 'next/navigation'
import { toastError } from '@/ui'
import { CardQueries, cardSchemas } from '@/entities/card'
import SortableCardItem from './CardList/SortableCardItem'
import CardItem from './CardList/CardItem'
import useUpdateCardRankMutation from '@/app/_hooks/mutation/card/useUpdateCardRankMutation'
import { cardTypesDto } from '@/service/api/card'
import { CardLists } from '@/entities/cardList/cardList.schemas'

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
}

/**
 * Defines a type for the transformed data structure used in drag and drop operations.
 * Creates a mapping where each card list ID maps to an array of card IDs contained within that list.
 */
type TransformedItems = Record<UniqueIdentifier, UniqueIdentifier[]>

/**
 * Transforms the card lists array into a structure optimized for dnd-kit operations.
 *
 * @param {cardListSchemas.CardLists} data - The original array of card list objects
 * @returns {TransformedItems} An object where:
 *   - Keys are card list IDs
 *   - Values are arrays of card IDs that belong to each card list
 */
const transformCardListsToItems = (data: cardListSchemas.CardLists): TransformedItems => {
  return data.reduce<TransformedItems>((acc, cardList) => {
    const cardListKey = cardList.id as UniqueIdentifier
    acc[cardListKey] = cardList.cards.map((c) => c.id as UniqueIdentifier)
    return acc
  }, {})
}

/**
 * Transforms an array of card lists into two separate lookup maps for efficient access.
 *
 * @param {cardListSchemas.CardLists} data - Array of card list objects
 * @returns {Object} Object containing two maps: cardListsMap and cardsMap
 */
const transformCardListsToMap = (data: cardListSchemas.CardLists) => {
  const cardListsMap: Record<string, cardListSchemas.CardList> = {}
  const cardsMap: Record<string, cardSchemas.Card> = {}

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

interface SortableCardListsProps {
  cardLists: CardLists
}

function SortableCardLists({ cardLists }: SortableCardListsProps) {
  const { boardId } = useParams()
  const queryClient = useQueryClient()

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

  // Initialize lists state with transformed data structure for drag and drop with dndkit
  const [lists, setLists] = useState<TransformedItems>(() => {
    return transformCardListsToItems(cardLists)
  })
  // State to store container IDs (each representing a card list)
  const [containers, setContainers] = useState(() => Object.keys(lists) as UniqueIdentifier[])
  // Updates lists and containers when fetched cardlists has changed
  useEffect(() => {
    const transformedLists = transformCardListsToItems(cardLists)
    setLists(transformedLists)
    setContainers(Object.keys(transformedLists) as UniqueIdentifier[])
  }, [cardLists])

  // For drag and drop of dnd-kit
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)
  const isSortingContainer = activeId != null ? containers.includes(activeId) : false

  const { mutate: updateCardListRank } = useUpdateCardListRankMutation({
    onMutate() {
      const previousData = queryClient.getQueryData(CardListQueries.cardListsByBoardQuery(boardId as string).queryKey)
      const previousLists = transformCardListsToItems(previousData as cardListSchemas.CardLists)
      const previousContainers = Object.keys(previousLists)

      return { previousData, previousLists, previousContainers }
    },
    onSuccess(data, variables, context) {
      const { id: updatedCardListId } = data
      queryClient.setQueryData(CardListQueries.cardListsByBoardQuery(boardId as string).queryKey, (oldData) => {
        return oldData
          ?.map((cardList) => (cardList.id === updatedCardListId ? data : cardList))
          .sort((a, b) => a.rank.localeCompare(b.rank))
      })
    },
    onError(error, variables, context) {
      console.error(error)
      const { previousLists, previousContainers } = context
      setLists(previousLists)
      setContainers(previousContainers)
      toastError("Failed to update card list's rank")
    }
  })

  const { mutate: updateCardRank } = useUpdateCardRankMutation({
    onMutate() {
      const previousData = queryClient.getQueryData(CardListQueries.cardListsByBoardQuery(boardId as string).queryKey)
      const previousLists = transformCardListsToItems(previousData as cardListSchemas.CardLists)

      return { previousLists }
    },
    onSuccess(data, variables, context) {
      // Takes cardListId in variables to know whether it has moved to a new cardlist
      const {
        updateCardRankDto: { oldCardListId, newCardListId }
      } = variables
      const { id: updatedCardId } = data

      queryClient.setQueryData(CardListQueries.cardListsByBoardQuery(boardId as string).queryKey, (oldData) => {
        if (!oldData) {
          return []
        }

        // Clone the data to avoid direct mutations
        const newData = [...oldData]

        // Takes cardlist container contains the updated card and container's indices
        const oldContainer = oldData?.find((cardList) => cardList.id === oldCardListId)
        const oldContainerIndex = oldData?.findIndex((c) => c.id === oldCardListId) as number

        if (oldContainerIndex === -1 || !oldContainer) return newData

        // Creates new cardlist container because of changes in cards of old cardlist
        if (newCardListId) {
          const newContainer = oldData?.find((cardList) => cardList.id === newCardListId)
          const newContainerIndex = oldData?.findIndex((c) => c.id === newCardListId) as number

          if (newContainerIndex === -1 || !newContainer) return newData

          newData[oldContainerIndex] = {
            ...oldContainer,
            cards: oldContainer?.cards
              .filter((card) => card.id !== updatedCardId)
              .sort((a, b) => a.rank.localeCompare(b.rank))
          }

          console.log('OLD CONTAINER: ', newData[oldContainerIndex])
          newData[newContainerIndex] = {
            ...newContainer,
            cards: [...(newContainer?.cards as cardSchemas.Cards), data].sort((a, b) => a.rank.localeCompare(b.rank))
          }

          return newData
        } else {
          const updatedContainer = {
            ...oldContainer,
            cards: oldContainer?.cards
              .map((card) => (card.id === updatedCardId ? data : card))
              .sort((a, b) => a.rank.localeCompare(b.rank))
          } as cardListSchemas.CardList

          return [
            ...(oldData?.slice(0, oldContainerIndex) || []),
            updatedContainer,
            ...(oldData?.slice(oldContainerIndex + 1) || [])
          ]
        }
      })
    },
    onError(error, variables, context) {
      console.log(error)
      const { previousLists } = context
      setLists(previousLists)
      toastError("Failed to update card's rank")
    }
  })

  // Adding sensors
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 80,
      tolerance: 50
    }
  })
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 80,
      tolerance: 50
    }
  })
  const sensors = useSensors(pointerSensor, mouseSensor)
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

  // Store old lists when drag event happening
  const [clonedLists, setClonedLists] = useState<TransformedItems | null>(null)

  const findContainer = (id: UniqueIdentifier) => {
    if (id in lists) {
      return id
    }

    return Object.keys(lists).find((key) => lists[key].includes(id))
  }

  // This function is created because in onDragEnd function couldn't capture right activeContainer and overContainer
  const findContainer2 = (id: UniqueIdentifier) => {
    if (!clonedLists) {
      return
    }

    if (id in clonedLists) {
      return id
    }

    return Object.keys(clonedLists).find((key) => clonedLists[key].includes(id))
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

  const onDragStart = ({ active }: DragStartEvent) => {
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
        const overItems = lists[overContainer]
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
    // Handle dragging card lists
    if (active.id in lists && over?.id && active.id !== over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id)
        const overIndex = containers.indexOf(over.id)

        return arrayMove(containers, activeIndex, overIndex)
      })

      // Handling calculation of cardlist's rank to call API to update cardlist's rank
      const activeIndex = containers.indexOf(active.id)
      const overIndex = containers.indexOf(over.id)
      const isDraggingUpward = activeIndex > overIndex

      let updateCardListRankDto = {} as cardListTypesDto.UpdateCardListRankDto
      updateCardListRankDto = isDraggingUpward
        ? {
            nextRank: cardListsMap[containers[overIndex]]?.rank,
            previousRank: cardListsMap[containers[overIndex - 1]]?.rank ?? null
          }
        : {
            nextRank: cardListsMap[containers[overIndex + 1]]?.rank ?? null,
            previousRank: cardListsMap[containers[overIndex]]?.rank
          }

      updateCardListRank({
        id: active.id as string,
        updateCardListRankDto
      })

      return
    }

    // Handle dragging cards
    if (!over || !over.id) {
      return
    }

    const activeContainer = findContainer2(activeId || '')
    const overContainer = findContainer(over?.id as UniqueIdentifier)

    if (!clonedLists) {
      return
    }

    if (!activeContainer || !overContainer) {
      setActiveId(null)
      return
    }

    if (activeContainer !== overContainer) {
      // Moving card to a different list
      const overContainerItems = lists[overContainer]
      let updateCardRankDto = {} as cardTypesDto.UpdateCardRankDto

      // Check if the target container is empty
      if (overContainerItems.length === 0) {
        // Moving to empty list - no previous or next cards
        updateCardRankDto = {
          oldCardListId: activeContainer as string,
          newCardListId: overContainer as string,
          nextRank: null,
          previousRank: null
        }
      } else {
        // Target container has cards
        const overIndex = overContainerItems.indexOf(over.id)

        if (overIndex === -1) {
          // over.id is the container itself (dropping at the end of the list)
          const lastCardInContainer = overContainerItems[overContainerItems.length - 1]
          updateCardRankDto = {
            oldCardListId: activeContainer as string,
            newCardListId: overContainer as string,
            nextRank: null,
            previousRank: cardsMap[lastCardInContainer]?.rank ?? null
          }
        } else {
          // Dropping between cards
          const activeIndex = lists[overContainer].indexOf(active.id)

          if (activeIndex !== -1) {
            setLists((lists) => ({
              ...lists,
              [overContainer]: arrayMove(lists[overContainer], activeIndex, overIndex)
            }))
          }

          updateCardRankDto = {
            oldCardListId: activeContainer as string,
            newCardListId: overContainer as string,
            nextRank: cardsMap[overContainerItems[overIndex + 1]]?.rank ?? null,
            previousRank: cardsMap[overContainerItems[overIndex - 1]]?.rank ?? null
          }
        }
      }

      updateCardRank({
        id: active.id as string,
        updateCardRankDto
      })
    } else {
      // Moving card within the same list
      const activeIndex = lists[activeContainer].indexOf(active.id)
      const overIndex = lists[activeContainer].indexOf(over.id)

      if (activeIndex === -1 || overIndex === -1) {
        setActiveId(null)
        return
      }

      setLists((lists) => ({
        ...lists,
        [overContainer]: arrayMove(lists[overContainer], activeIndex, overIndex)
      }))

      let updateCardRankDto = {
        oldCardListId: activeContainer as string,
        newCardListId: null
      } as cardTypesDto.UpdateCardRankDto

      const isDraggingUpward = activeIndex > overIndex
      const overContainerItems = lists[overContainer]

      updateCardRankDto = isDraggingUpward
        ? {
            ...updateCardRankDto,
            nextRank: cardsMap[overContainerItems[overIndex]]?.rank,
            previousRank: cardsMap[overContainerItems[overIndex - 1]]?.rank ?? null
          }
        : {
            ...updateCardRankDto,
            nextRank: cardsMap[overContainerItems[overIndex + 1]]?.rank ?? null,
            previousRank: cardsMap[overContainerItems[overIndex]]?.rank
          }

      updateCardRank({
        id: active.id as string,
        updateCardRankDto
      })
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
      onDragCancel={onDragCancel}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <div className='flex-1 overflow-x-auto'>
        <SortableContext items={[...containers]} strategy={horizontalListSortingStrategy}>
          <div className='flex max-w-fit list-none gap-2 p-2'>
            {containers?.map((containerId) => (
              <SortableCardList key={containerId} cardListData={cardListsMap[containerId]}>
                <SortableContext items={[...lists[containerId]]} strategy={verticalListSortingStrategy}>
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
