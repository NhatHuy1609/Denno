import React, { useState, useRef, useEffect } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutside'
import { DraggableSyntheticListeners } from '@dnd-kit/core'

interface IProps {
  name?: string
  listeners?: DraggableSyntheticListeners
  setActivatorNodeRef?: (element: HTMLElement | null) => void
}

export default function CardListHeader({ name, setActivatorNodeRef, listeners }: IProps) {
  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <HeaderName name={name} listeners={listeners} />
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
  name,
  listeners,
  setDisabledDnd,
  setActivatorNodeRef
}: {
  name?: string
  listeners?: DraggableSyntheticListeners
  setActivatorNodeRef?: (element: HTMLElement | null) => void
  setDisabledDnd?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isShowingInput, setShowingInput] = useState(false)

  const handleShowInput = () => {
    setShowingInput(true)
  }

  const handleHideInput = () => {
    setShowingInput(false)
    setDisabledDnd && setDisabledDnd(false)
  }

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
        {name}
      </h3>
      {isShowingInput && (
        <PrimaryInputText ref={inputRef} defaultValue={name} className='absolute inset-0' />
      )}
    </div>
  )
}
