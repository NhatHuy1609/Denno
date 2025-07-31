'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useRequireAuth } from '@/app/_hooks/useRequireAuth'
import useBoardViewPolicy from '@/permissions/hooks/useBoardViewPolicy'
import useRecentAccessSync from './useRecentAccessSync'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'
import BoardView from '@/app/_features/BoardViews/BoardView'
import PrivateBoardAccessRequest from './PrivateBoardAccessRequest'
import PrimarySidebar from '@/layouts/shared/PrimarySidebar'

function BoardHomePage() {
  // Apply auth guard
  const { isCheckingAuth } = useRequireAuth()

  const { boardId } = useParams<{ boardId: string }>()
  const {
    workspaceId = '',
    canView: canViewBoard,
    isLoading: isCheckingBoardViewPolicyAccess
  } = useBoardViewPolicy(boardId)

  useRecentAccessSync(boardId, workspaceId)

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
