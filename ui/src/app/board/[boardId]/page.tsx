'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/persisted-keys'
import BoardView from '@/app/_features/BoardViews/BoardView'
import { useBoardQuery } from '@/app/_hooks/query'

function BoardHomePage() {
  const { boardId } = useParams<{ boardId: string }>()
  const { data: boardData } = useBoardQuery(boardId, {
    includeWorkspace: true
  })
  const { workspaceId } = boardData || {}

  const [_1, setRecentAccessBoardId] = useSyncedLocalStorage(
    PersistedStateKey.RecentAccessBoard,
    ''
  )
  const [_2, setRecentAccessWorkspaceId] = useSyncedLocalStorage(
    PersistedStateKey.RecentAccessWorkspace,
    ''
  )

  // Sync recent access board id with local storage
  useEffect(() => {
    if (boardId) {
      setRecentAccessBoardId(boardId as string)
    }
  }, [boardId, setRecentAccessBoardId])

  // Sync recent access workspace id with local storage
  useEffect(() => {
    if (workspaceId) {
      setRecentAccessWorkspaceId(workspaceId as string)
    }
  }, [workspaceId])

  console.log('WORKSPACE ID GOT BY FETCHED BOARD: ', workspaceId)

  return (
    <div className='flex size-full max-w-full flex-col'>
      <BoardView />
    </div>
  )
}

export default BoardHomePage
