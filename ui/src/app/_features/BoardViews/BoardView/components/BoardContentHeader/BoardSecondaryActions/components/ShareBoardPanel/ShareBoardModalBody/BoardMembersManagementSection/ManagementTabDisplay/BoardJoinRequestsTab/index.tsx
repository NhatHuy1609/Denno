import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'
import { useBoardQuery } from '@/app/_hooks/query'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import React from 'react'

function BoardJoinRequestsTab() {
  const [boardId, setRecentAccessBoardId] = useSyncedLocalStorage<string>(
    PersistedStateKey.RecentAccessBoard,
    ''
  )
  const { data: boardData, isPending } = useBoardQuery(boardId, {
    includeBoardMembers: true,
    includeJoinRequests: true
  })

  const { joinRequests } = boardData || {}

  if (isPending) {
    return (
      <div className='flex w-full items-center justify-center p-4'>
        <WaterFallLoading />
      </div>
    )
  }

  if (!joinRequests?.length) {
    return (
      <div className='flex w-full items-center justify-center p-4 text-lg text-gray-500'>
        No join requests found!
      </div>
    )
  }

  return <div>BoardJoinRequestsTab</div>
}

export default BoardJoinRequestsTab
