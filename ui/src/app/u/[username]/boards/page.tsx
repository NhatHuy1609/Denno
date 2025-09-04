'use client'

import React from 'react'
import type { boardSchemas } from '@/entities/board'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import { useUserBoardsQuery } from '@/app/_hooks/query/user/useUserBoardsQuery'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'
import GroupedBoardsByWorkspace from './_components/GroupedBoardsByWorkspace'
import StarredBoards from './_components/StarredBoards'
import { useRecentBoards } from '@/app/_hooks/query/board/useRecentBoards'
import RecentBoards from './_components/RecentBoards'

function page() {
  const { data: userBoards, isLoading: isLoadingUserBoards } = useUserBoardsQuery(
    getLocalStorageItem(PersistedStateKey.MeId),
    {
      starredBoards: true
    }
  )

  const { successfulData: recentBoards = [], isAnyLoading: isLoadingRecentBoards } = useRecentBoards()

  // Take boards and starredBoards from userBoards
  const { boards = [], starredBoards = [] } = userBoards || {}

  // Group boards by workspaceId
  const groupedBoardsByWorkspaceId = boards?.reduce(
    (acc, board) => {
      if (!acc[board.workspaceId]) {
        acc[board.workspaceId] = []
      }
      acc[board.workspaceId].push(board)

      return acc
    },
    {} as Record<string, boardSchemas.Board[]>
  )

  if (isLoadingUserBoards || isLoadingRecentBoards) {
    return (
      <div className='flex w-full items-center justify-center'>
        <WaterFallLoading />
      </div>
    )
  }

  return (
    <div className='w-full'>
      {/* Render starredBoards here */}
      {starredBoards.length > 0 && <StarredBoards boards={starredBoards} />}
      {/* Render recentBoards here */}
      {recentBoards.length > 0 && <RecentBoards boards={recentBoards} />}
      {/* Render boards here */}
      {Object.keys(groupedBoardsByWorkspaceId).map((workspaceId) => (
        <GroupedBoardsByWorkspace
          key={workspaceId}
          workspaceId={workspaceId}
          boards={groupedBoardsByWorkspaceId[workspaceId]}
        />
      ))}
    </div>
  )
}

export default page
