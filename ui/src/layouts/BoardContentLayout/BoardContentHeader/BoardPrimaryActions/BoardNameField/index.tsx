import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/styles/utils'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useBoardQuery } from '@/app/_hooks/query'
import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutSide'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import CustomizableButton from '@/ui/components/CustomizableButton'

function BoardNameField() {
  const boardId = getLocalStorageItem(PersistedStateKey.RecentAccessBoard)
  const { data: board } = useBoardQuery(boardId)

  const containerRef = useRef<HTMLDivElement>(null)
  // Span to measure the width of the input text
  // Using a ref to access the input element directly for dynamic width calculation
  const spanRef = useRef<HTMLSpanElement>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const [isShowInput, setIsShowInput] = useState(false)

  const { name } = board || {}
  const inputValue = inputRef.current?.value || ''

  // Handle click outside to hide the input and update the board name
  useOnClickOutSide(inputRef, () => {
    if (isShowInput) {
      setIsShowInput(false)
      handleUpdateBoardName()
    }
  })

  const handleUpdateBoardName = () => {
    if (inputValue.trim()) {
      // Assuming you have a function to update the board name
    }
  }

  const handleClickBoardField = () => {
    setIsShowInput(!isShowInput)
  }

  // Focus the input when it is shown
  useEffect(() => {
    if (isShowInput && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isShowInput])

  // Dynamically set the width of the input based on the span's width
  useEffect(() => {
    if (spanRef.current && inputRef.current && containerRef.current) {
      const spanWidth = spanRef.current.offsetWidth
      inputRef.current.style.width = `${spanWidth + 12}px` // Adding some padding
      containerRef.current.style.width = `${spanWidth + 20}px` // Adjusting container width
    }
  }, [inputValue])

  return (
    <div className='relative flex h-full items-center' ref={containerRef}>
      <PrimaryInputText
        ref={inputRef}
        defaultValue={name}
        className={cn('absolute w-full text-xl font-medium', {
          hidden: !isShowInput
        })}
      />
      <h1
        onClick={handleClickBoardField}
        className={cn(
          'absolute cursor-pointer whitespace-nowrap rounded-sm px-2 py-1 text-xl font-medium text-white hover:bg-white/20 hover:opacity-100',
          {
            hidden: isShowInput
          }
        )}
      >
        {name || ''}
      </h1>

      {/* This span is used for measuring the input text width dynamically to auto-resize the input element */}
      <span
        ref={spanRef}
        className='pl-2 text-xl font-medium'
        style={{
          visibility: 'hidden',
          position: 'absolute',
          display: 'block',
          whiteSpace: 'nowrap'
        }}
      >
        {name || ''}
      </span>
    </div>
  )
}

export default BoardNameField
