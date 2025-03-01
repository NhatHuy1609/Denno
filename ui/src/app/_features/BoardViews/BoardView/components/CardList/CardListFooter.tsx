import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import CustomizableButton from '@/ui/components/CustomizableButton'
import CardAddForm from './CardAddForm'

function CardListFooter() {
  const [showCardAddForm, setShowCardAddForm] = useState(false)

  const handleShowForm = () => {
    setShowCardAddForm(true)
  }

  const handleHideForm = () => {
    setShowCardAddForm(false)
  }

  return (
    <div className='flex-1'>
      {showCardAddForm ? (
        <CardAddForm hideFormFn={handleHideForm} />
      ) : (
        <CustomizableButton
          value='Add a card'
          startIcon={<FiPlus />}
          intent='ghost'
          size='small'
          onClick={() => handleShowForm()}
          className='w-full rounded-lg'
        />
      )}
    </div>
  )
}

export default CardListFooter
