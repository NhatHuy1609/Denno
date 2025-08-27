import React from 'react'
import { useUserJoinedBoardsQuery } from '@/app/_hooks/query/user/useUserJoinedBoardsQuery'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/persisted-keys'
import JoinedBoardDisplayItem from './JoinedBoardDisplayItem'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'

type Props = {
  userId: string
}

function JoinedBoardDisplay({ userId }: Props) {
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')

  const { data: joinedBoards, isLoading } = useUserJoinedBoardsQuery(
    userId,
    {
      workspaceId
    },
    {
      enabled: !!userId && !!workspaceId
    }
  )

  if (isLoading) {
    return (
      <div className='flex w-full justify-center'>
        <WaterFallLoading />
      </div>
    )
  }

  return (
    <div className='mt-2 flex flex-col'>
      {joinedBoards?.map((board) => <JoinedBoardDisplayItem key={board.id} board={board} />)}
    </div>
  )
}

export default JoinedBoardDisplay
