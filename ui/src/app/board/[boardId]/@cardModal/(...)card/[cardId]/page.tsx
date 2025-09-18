'use client'

import React from 'react'
import CardDetailModal from '@/app/_features/CardDetailModal'
import { useParams } from 'next/navigation'

function CardPage() {
  const { boardId, cardId } = useParams<{ boardId: string; cardId: string }>()

  return (
    <div className='fixed inset-0 z-[1] flex justify-center bg-black/60'>
      <div className='absolute top-[20%]'>
        <CardDetailModal cardId={cardId} boardId={boardId} />
      </div>
    </div>
  )
}

export default CardPage
