import { useCardListQuery } from '@/app/_hooks/query/cardList/useCardListQuery'
import React from 'react'
import CardModalHeaderActions from './CardModalHeaderActions'

type Props = {
  cardListId: string
}

function CardModalHeader({ cardListId }: Props) {
  const { data: cardListData } = useCardListQuery(cardListId, { enabled: !!cardListId })
  const { name: cardListName } = cardListData || {}

  return (
    <div className='flex w-full items-center justify-between border-b border-gray-300 px-6 py-4'>
      <span className='rounded-sm bg-gray-300 px-2 py-1 text-sm font-semibold text-black'>{cardListName}</span>
      <CardModalHeaderActions />
    </div>
  )
}

export default CardModalHeader
