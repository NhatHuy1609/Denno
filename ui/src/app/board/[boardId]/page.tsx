'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useMe } from '@/app/_hooks/query/user/useMe'
import BoardView from '@/app/_features/BoardViews/BoardView'
import PrivateBoardAccessRequest from './PrivateBoardAccessRequest'
import useBoardPolicyAccess from '@/permissions/hooks/useBoardPolicyAccess'
import useRecentAccessSync from './useRecentAccessSync'

function BoardHomePage() {
  const { boardId } = useParams<{ boardId: string }>()
  const { workspaceId = '', canView: canViewBoard } = useBoardPolicyAccess(boardId)

  useRecentAccessSync(boardId, workspaceId)

  // Checks if the user should be denied access to the board.
  if (!canViewBoard) {
    return <PrivateBoardAccessRequest />
  }

  return (
    <div className='flex size-full max-w-full flex-col'>
      <BoardView />
    </div>
  )
}

export default BoardHomePage
