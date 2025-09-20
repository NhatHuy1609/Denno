import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { cardSchemas } from '@/entities/card'
import CardTitleRow from './CardTitleRow'
import CardMemberInfoRow from './CardMemberInfoRow'
import CardDetailsInfoRow from './CardDetailsInfoRow'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

type Props = {
  cardData: cardSchemas.Card
  isDragging?: boolean
}

function CardItem({ cardData, isDragging = false }: Props) {
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard)
  const [isHover, setIsHover] = useState(false)

  useEffect(() => {
    if (isDragging) {
      setIsHover(false)
    }
  }, [isDragging])

  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsHover(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsHover(false)
    }
  }

  return (
    <Link
      href={`/board/${boardId}/card/${cardData.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='flex w-full flex-col gap-2 rounded-lg border-2 border-transparent bg-white px-3 py-[6px] shadow-[0_1px_1px_rgba(0,0,0,0.15)] hover:border-2 hover:border-blue-500'
    >
      <CardTitleRow isHover={isHover} cardData={cardData} />
      <CardDetailsInfoRow cardData={cardData} />
      <CardMemberInfoRow cardId={cardData.id} />
    </Link>
  )
}

export default CardItem
