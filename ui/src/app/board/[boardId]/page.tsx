'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRequireAuth } from '@/app/_hooks/useRequireAuth'
import useBoardViewPolicy from '@/permissions/hooks/useBoardViewPolicy'
import useRecentAccessSync from './_hooks/useRecentAccessSync'
import { useBoardDataSetup } from './_hooks/useBoardDataSetup'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'
import BoardView from '@/app/_features/BoardViews/BoardView'
import PrivateBoardAccessRequest from './_components/PrivateBoardAccessRequest'
import PrimarySidebar from '@/layouts/shared/PrimarySidebar'
import { useRouter } from 'next/navigation'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useHubEventListener } from '@/app/_hooks/signalR/useHubEventListener'
import { useHubInvoke } from '@/app/_hooks/signalR/useHubInvoke'

function BoardHomePage() {
  // Apply auth guard
  const { isCheckingAuth } = useRequireAuth()
  const router = useRouter()
  const { boardId } = useParams<{ boardId: string }>()
  const currentUserId = getLocalStorageItem(PersistedStateKey.MeId)

  // Check if the user has permission to view the board
  const {
    workspaceId = '',
    canView: canViewBoard,
    isLoading: isCheckingBoardViewPolicyAccess
  } = useBoardViewPolicy(boardId)

  // Set up board data if the user has access to view board
  const { isLoading: isLoadingBoardData } = useBoardDataSetup(boardId, canViewBoard)

  // Sync recent access to localstorage for the board
  useRecentAccessSync(boardId, workspaceId)

  // Join board once connected
  const invoke = useHubInvoke()
  useEffect(() => {
    if (!boardId) return

    invoke('board', 'JoinBoard', boardId)
  }, [invoke, boardId])

  // Listen to "OnWorkspaceMemberRemoved" event
  useHubEventListener(
    'workspace',
    'OnWorkspaceMemberRemoved',
    (removedUserId, actorUserId, workspaceId, removeRelatedAccessibleBoards) => {
      if (removedUserId === currentUserId && removeRelatedAccessibleBoards) {
        router.replace('/')
        setTimeout(() => {
          router.push(`board/${boardId}`)
        }, 0)
      }
    }
  )

  if (isCheckingAuth || isCheckingBoardViewPolicyAccess) {
    return (
      <div className='mt-10 flex w-full items-center justify-center'>
        <WaterFallLoading />
      </div>
    )
  }

  // Checks if the user should be denied access to the board.
  if (!canViewBoard) {
    return <PrivateBoardAccessRequest />
  }

  return (
    <div className='flex size-full max-w-full'>
      <PrimarySidebar />
      <BoardView />
    </div>
  )
}

export default BoardHomePage
