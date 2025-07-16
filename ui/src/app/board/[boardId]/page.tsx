'use client'

import React, { useEffect } from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useParams, useRouter } from 'next/navigation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { useBoardQuery } from '@/app/_hooks/query'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { includesBy } from '@/utils/includesBy'
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
  const [_1, setBoardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')
  const [_2, setWorkspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')

  const { workspaceId, members } = boardData || {}

  // Sync recent access board id with local storage
  useEffect(() => {
    boardId && setBoardId(boardId as string)
  }, [boardId])

  // Sync recent access workspace id with local storage
  useEffect(() => {
    workspaceId && setWorkspaceId(workspaceId as string)
  }, [workspaceId])

  // Checks if the user should be denied access to the board.
  const shouldBlockAccess = (): boolean => {
    if (!currentUser || !members) return false

    var isWorkspaceMember = includesBy(members, (member) => member.memberId === currentUser.id)
    var isBoardPrivate = boardData?.visibility === 'Private'

    return !isWorkspaceMember || isBoardPrivate
  }

  if (shouldBlockAccess()) {
    return <PrivateBoardAccessRequest />
  }

  return (
    <div className='flex size-full max-w-full flex-col'>
      <BoardView />
    </div>
  )
}

export default BoardHomePage
