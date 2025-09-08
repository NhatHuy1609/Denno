import { cardSchemas } from '@/entities/card'
import React from 'react'

type Props = {
  cardData: cardSchemas.Card
}

function CardItem({ cardData }: Props) {
  const { name } = cardData

  return (
    <div className='w-full rounded-lg border-2 border-transparent bg-white px-3 py-[6px] shadow-[0_1px_1px_rgba(0,0,0,0.15)] hover:border-2 hover:border-blue-500'>
      <span className='text-sm'>{name}</span>
    </div>
  )
}

export default CardItem
