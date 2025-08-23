'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRequireAuth } from '@/app/_hooks/useRequireAuth'
import useBoardViewPolicy from '@/permissions/hooks/useBoardViewPolicy'
import useRecentAccessSync from './useRecentAccessSync'
import { useBoardDataSetup } from './useBoardDataSetup'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'
import BoardView from '@/app/_features/BoardViews/BoardView'
import PrivateBoardAccessRequest from './PrivateBoardAccessRequest'
import PrimarySidebar from '@/layouts/shared/PrimarySidebar'
import { useSignalR } from '@/app/_providers/SignalRProvider/useSignalR'
import { useRouter } from 'next/navigation'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'

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

  const { signalRService } = useSignalR()

  // This effect is used to join the board when the user has access to  the board
  useEffect(() => {
    if (!boardId || !signalRService) return

    const onWorkspaceMemberRemoved = (removedUserId: string) => {
      if (removedUserId === currentUserId) {
        router.replace('/')
        setTimeout(() => {
          router.push(`board/${boardId}`)
        }, 0)
      }
    }

    signalRService.invoke('board', 'JoinBoard', boardId)

    signalRService.on('workspace', 'OnWorkspaceMemberRemoved', onWorkspaceMemberRemoved)

    return () => {
      signalRService.off('workspace', 'OnWorkspaceMemberRemoved', onWorkspaceMemberRemoved)
    }
  }, [signalRService, boardId, router])

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
