import React from 'react'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'
import { useBoardQuery } from '@/app/_hooks/query'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import BoardJoinRequestItem from './BoardJoinRequestItem'

function BoardJoinRequestsTab() {
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')
  const {
    data: boardData,
    isPending,
    refetch: refetchBoardData
  } = useBoardQuery(boardId, {
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
      <div className='flex w-full items-center justify-center p-4 text-lg text-gray-500'>No join requests found!</div>
    )
  }

  const onApproveJoinRequest = () => {
    refetchBoardData()
  }

  const onRejectJoinRequest = () => {
    refetchBoardData()
  }

  return (
    <div className='w-full'>
      <ul className='w-full list-none'>
        {joinRequests.map((joinRequest) => (
          <li key={joinRequest.id}>
            <BoardJoinRequestItem
              request={joinRequest}
              onApprove={onApproveJoinRequest}
              onReject={onRejectJoinRequest}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BoardJoinRequestsTab
