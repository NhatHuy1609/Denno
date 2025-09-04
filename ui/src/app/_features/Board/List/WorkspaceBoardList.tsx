import React from 'react'
import { FaRegUser } from 'react-icons/fa6'
import BoardList from './BoardList'
import { useParams } from 'next/navigation'
import { useBoardsByWorkspace } from '@/app/_hooks/query/board/useBoardsByWorkspace'

function WorkspaceBoardList() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data = [], refetch } = useBoardsByWorkspace(workspaceId as string)

  const onToggleStarBoard = () => {
    refetch()
  }

  return (
    <div className='w-full'>
      <div className='flex items-center gap-2'>
        <FaRegUser className='text-xl text-slate-700' />
        <span className='text-base font-semibold text-gray-700'>Your boards</span>
      </div>
      <div className='mt-3 w-full'>
        <BoardList boards={data} selectedWorkspaceId={workspaceId} onToggleStarBoard={onToggleStarBoard} />
      </div>
    </div>
  )
}

export default WorkspaceBoardList
