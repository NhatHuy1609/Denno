import React, { useEffect, useRef, useState } from 'react'
import { AnimatedCircleCheckbox } from '@/app/_components/AnimatedCircleCheckbox'
import { useCardDetailModalContext } from '../../context'
import EditableNameField from '@/app/_components/EditableNameField'
import { useToggleCardCompletionStatus } from '@/app/_hooks/mutation/card/useToggleCardCompletionStatus'
import useUpdateCardMutation from '@/app/_hooks/mutation/card/useUpdateCardMutation'

function CardTitleRow() {
  const nameFieldRef = useRef<HTMLInputElement>(null)
  const { cardData, refetchCard } = useCardDetailModalContext()
  const { name: cardName = '', isCompleted = false } = cardData || {}

  const [isChecked, setIsChecked] = useState(false)

  const { toggleCardCompletionStatusAsync } = useToggleCardCompletionStatus({
    cardId: cardData?.id || '',
    isCompleted: isChecked,
    onMarkAsInCompletedFailed: () => {
      setIsChecked(true)
    },
    onMarkAsCompletedFailed: () => {
      setIsChecked(false)
    }
  })

  const { mutateAsync: updateCardAsync } = useUpdateCardMutation({
    onSuccess: () => {
      refetchCard?.()
    },
    onError: (error) => {
      console.error(error)
    }
  })

  useEffect(() => {
    setIsChecked(isCompleted)
  }, [isCompleted])

  const handleToggleCheckbox = async () => {
    setIsChecked(!isChecked)
    await toggleCardCompletionStatusAsync()
  }

  const handleSubmitNewCardName = () => {
    updateCardAsync({
      id: cardData?.id || '',
      updateCardDto: {
        name: nameFieldRef.current?.value || ''
      }
    })
  }

  return (
    <div className='flex w-full items-center gap-4'>
      <AnimatedCircleCheckbox checked={isChecked} onChange={handleToggleCheckbox} />
      <div className='flex w-full flex-1'>
        <EditableNameField
          name={cardName}
          ref={nameFieldRef}
          fullWidth
          enabledEdit
          onSubmit={handleSubmitNewCardName}
          size='xl'
        />
      </div>
    </div>
  )
}

export default CardTitleRow
