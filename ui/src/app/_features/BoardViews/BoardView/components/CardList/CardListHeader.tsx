import React, { useState, useRef, useEffect, useCallback } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutside'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import useUpdateCardListMutation from '../../mutations/updateCardList.mutation'
import { useQueryClient } from '@tanstack/react-query'
import { toastError, toastSuccess } from '@/ui'
import { CardListQueries, cardListTypes } from '@/entities/cardList'
import { cardListTypesDto } from '@/service/api/cardList'

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
    onSuccess() {
      toastSuccess("Update card list's name successfully")
    },
    onError(error, variables, context) {
      console.log(context)
      setCardListName(context.previousCardListName)
      toastError("Failed to update card list's name")
    }
  })

  const handleShowInput = () => {
    setShowingInput(true)
  }

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
        <PrimaryInputText ref={inputRef} defaultValue={cardListName} className='absolute inset-0' />
      )}
    </div>
  )
}
