'use client'

import CardDetailModal from '@/app/_features/CardDetailModal'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useParams } from 'next/navigation'
import React from 'react'

function CardPage() {
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard)
  const { cardId } = useParams<{ cardId: string }>()

  return <CardDetailModal cardId={cardId} boardId={boardId} />
}

export default CardPage
