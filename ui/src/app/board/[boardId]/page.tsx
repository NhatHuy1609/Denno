'use client'

import React, { useEffect } from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useParams, useRouter } from 'next/navigation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { useBoardQuery } from '@/app/_hooks/query'
import { useMe } from '@/app/_hooks/query/user/useMe'
import BoardView from '@/app/_features/BoardViews/BoardView'
import PrivateBoardAccessRequest from './PrivateBoardAccessRequest'

function BoardHomePage() {
  const router = useRouter()
  const { data: currentUser } = useMe()
  const { boardId } = useParams<{ boardId: string }>()
  const { data: boardData } = useBoardQuery(boardId, {
    includeWorkspace: true,
    includeBoardMembers: true
  })

  const { workspaceId, members } = boardData || {}

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

  // Handle redirect if current user is not a member of the board
  if (currentUser && members) {
    if (!members.some((member) => member.memberId === currentUser.id)) {
      return <PrivateBoardAccessRequest />
    }
  }

  return (
    <div className='flex size-full max-w-full flex-col'>
      <BoardView />
    </div>
  )
}

export default BoardHomePage
