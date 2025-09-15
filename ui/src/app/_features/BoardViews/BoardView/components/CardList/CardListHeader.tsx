import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import useUpdateCardListMutation from '../../mutations/updateCardList.mutation'
import { cardListTypesDto } from '@/service/api/cardList'
import { CardListQueries, cardListSchemas } from '@/entities/cardList'
import { toastError } from '@/ui'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import { useOnClickOutside } from '@/app/_hooks/useOnClickOutSide'

interface IProps {
  cardListData?: cardListSchemas.CardList
  listeners?: DraggableSyntheticListeners
  setActivatorNodeRef?: (element: HTMLElement | null) => void
}

export default function CardListHeader({ cardListData, setActivatorNodeRef, listeners }: IProps) {
  return (
    <div className='w-full cursor-grab'>
      <div className='flex w-full items-center justify-between'>
        <HeaderName cardListData={cardListData} listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} />
        <button
          type='button'
          className='flex size-8 items-center justify-center rounded-md hover:bg-[var(--ds-accent-background-hovered)]'
        >
          <HiOutlineDotsHorizontal />
        </button>
      </div>
    </div>
  )
}

function HeaderName({
  cardListData,
  listeners,
  setActivatorNodeRef
}: {
  cardListData?: cardListSchemas.CardList
  listeners?: DraggableSyntheticListeners
  setActivatorNodeRef?: (element: HTMLElement | null) => void
}) {
  const { boardId } = useParams()
  const queryClient = useQueryClient()
  const [isShowingInput, setShowingInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  /**
   * State is used to store the previous card list name before updating to the new name.
   * The cardListName cannot be used to capture the old name in the onError callback of useUpdateCardListMutation for rollback purposes.
   */
  const oldCardListName = useRef<string>(cardListData?.name || '')

  // For optimistic update cardlist's name
  const [cardListName, setCardListName] = useState(cardListData?.name)

  const { mutate: updateCardList } = useUpdateCardListMutation({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: CardListQueries.cardListsByBoardQuery(boardId as string).queryKey
      })
    },
    onError(error, variables, context) {
      setCardListName(oldCardListName.current)
      toastError("Failed to update card list's name")
    }
  })

  const handleHideInput = useCallback(() => {
    setShowingInput(false)
    if (oldCardListName.current !== inputRef.current?.value) {
      const updateCardListDto = {
        name: inputRef.current?.value || '',
        rank: cardListData?.rank || ''
      } as cardListTypesDto.UpdateCardListDto

      // Calling API to update card list's name in background
      updateCardList({
        id: cardListData?.id || '',
        updateCardListDto
      })

      // Store old cardlist's name before updating
      oldCardListName.current = cardListName || ''

      setCardListName(inputRef.current?.value)
    }
  }, [cardListData])

  useOnClickOutside(inputRef, () => {
    if (isShowingInput) {
      handleHideInput()
    }
  })

  // Auto select input when it is opened
  useEffect(() => {
    if (inputRef && isShowingInput) {
      inputRef.current?.select()
    }
  }, [inputRef, isShowingInput])

  const handleShowInput = () => {
    setShowingInput(true)
  }

  const handleKeydownInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleHideInput()
    }
  }

  return (
    <div onClick={handleShowInput} className='relative w-full flex-1 py-1 pl-3'>
      <h3 {...listeners} ref={setActivatorNodeRef} className='text-sm font-medium text-[var(--ds-accent-text)]'>
        {cardListName}
      </h3>
      {isShowingInput && (
        <PrimaryInputText
          ref={inputRef}
          defaultValue={cardListName}
          onKeyDown={handleKeydownInput}
          className='absolute inset-0'
        />
      )}
    </div>
  )
}
