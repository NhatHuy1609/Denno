import React from 'react'
import CardDatesUpdateForm from './CardDatesUpdateForm'

type Props = {
  onClosePanel: () => void
}

function CardDatesActionPanel({ onClosePanel }: Props) {
  return (
    <div className='w-full'>
      <h3 className='text-center text-sm font-semibold text-gray-700'>Dates</h3>
      <CardDatesUpdateForm onClosePanel={onClosePanel} />
    </div>
  )
}

export default CardDatesActionPanel
