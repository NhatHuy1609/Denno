import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutSide'
import useUpdateCardListMutation from '../../mutations/updateCardList.mutation'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { cardListTypesDto } from '@/service/api/cardList'
import { CardListQueries, cardListTypes } from '@/entities/cardList'
import { toastError, toastSuccess } from '@/ui'
import PrimaryInputText from '@/app/_components/PrimaryInputText'

interface IProps {
  cardListData?: cardListTypes.CardList
  listeners?: DraggableSyntheticListeners
  setActivatorNodeRef?: (element: HTMLElement | null) => void
}

export default function CardListHeader({ cardListData, setActivatorNodeRef, listeners }: IProps) {
  return (
    <div className='w-full cursor-grab'>
      <div className='flex w-full items-center justify-between'>
        <HeaderName
          cardListData={cardListData}
          listeners={listeners}
          setActivatorNodeRef={setActivatorNodeRef}
        />
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
  cardListData?: cardListTypes.CardList
  listeners?: DraggableSyntheticListeners
  setActivatorNodeRef?: (element: HTMLElement | null) => void
}) {
  const queryClient = useQueryClient()

  const inputRef = useRef<HTMLInputElement>(null)

  const [isShowingInput, setShowingInput] = useState(false)

  // For optimistic update cardlist's name
  const [cardListName, setCardListName] = useState(cardListData?.name)

  const { mutate: updateCardList } = useUpdateCardListMutation({
    onMutate() {
      // Consider to refractor this code to handle get cardlist's old name
      const prevCardLists = queryClient.getQueryData(
        CardListQueries.cardListsByBoardQuery(cardListData?.boardId as string).queryKey
      )
      const previousCardListName = prevCardLists?.find(
        (cardList) => cardList.id === cardListData?.id
      )?.name

      return { previousCardListName }
    },
    onError(error, variables, context) {
      setCardListName(context.previousCardListName)
      toastError("Failed to update card list's name")
    }
  })

  const handleHideInput = useCallback(() => {
    setShowingInput(false)
    // Calling API to update card list's name in background
    const updateCardListDto: cardListTypesDto.UpdateCardListDto = {
      name: inputRef.current?.value || '',
      rank: cardListData?.rank || ''
    }
    updateCardList({
      id: cardListData?.id || '',
      updateCardListDto
    })

    setCardListName(inputRef.current?.value)
  }, [cardListData])

  useOnClickOutSide(inputRef, handleHideInput)

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
      <h3
        {...listeners}
        ref={setActivatorNodeRef}
        className='text-sm font-medium text-[var(--ds-accent-text)]'
      >
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
