'use client'

import React, { useEffect } from 'react'
import BoardView from '@/app/_features/BoardViews/BoardView'
import { useParams } from 'next/navigation'
import { setLocalStorageItem } from '@/utils/local-storage'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/persisted-keys'

function BoardHomePage() {
  const { boardId } = useParams()
  const [_, setRecentAccessBoardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')

  // Sync recent access board id with local storage
  useEffect(() => {
    if (boardId) {
      setRecentAccessBoardId(boardId as string)
    }
  }, [boardId, setRecentAccessBoardId])

  return (
    <div className='flex size-full max-w-full flex-col'>
      <BoardView />
    </div>
  )
}

export default BoardHomePage
