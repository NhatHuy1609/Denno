import React from 'react'
import { boardSchemas } from '@/entities/board'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import BoardList from '@/app/_features/Board/List/BoardList'
import WorkspaceLogo from '@/app/_components/WorkspaceLogo'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useUserBoardsQuery } from '@/app/_hooks/query/user/useUserBoardsQuery'

type Props = {
  workspaceId: string
  boards: boardSchemas.Board[]
}

function GroupedBoardsByWorkspace({ workspaceId, boards }: Props) {
  const { refetch } = useUserBoardsQuery(getLocalStorageItem(PersistedStateKey.MeId), {
    starredBoards: true
  })

  const { data: workspaceData } = useWorkspaceQuery(workspaceId)

  const { name: workspaceName, logo: workspaceLogoSrc } = workspaceData || {}

  const onToggleStarBoard = () => {
    refetch()
  }

  return (
    <div className='my-8 w-full'>
      <div className='my-2 flex w-auto items-center gap-2'>
        <WorkspaceLogo size='base' imageUrl={workspaceLogoSrc} name={workspaceName || ''} />
        <h2 className='text-base font-bold'>{workspaceName}</h2>
      </div>
      <BoardList
        key={workspaceId}
        boards={boards}
        selectedWorkspaceId={workspaceId}
        onToggleStarBoard={onToggleStarBoard}
      />
    </div>
  )
}

export default GroupedBoardsByWorkspace
