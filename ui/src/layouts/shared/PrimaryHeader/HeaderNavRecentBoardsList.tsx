import React from 'react'
import Image from 'next/image'
import BoardLinkNavigation from '@/app/_components/BoardLinkNavigation'
import { useRecentBoards } from '@/app/_hooks/query/board/useRecentBoards'
import { boardSchemas } from '@/entities/board'

function HeaderNavRecentBoardItem({ board }: { board: boardSchemas.Board }) {
  const { id: boardId, background, name } = board

  return (
    <BoardLinkNavigation
      boardId={boardId}
      className='block flex w-full items-center gap-2 rounded-sm p-2 hover:bg-gray-100'
    >
      <Image className='aspect-[3/2] w-8 rounded-sm' src={background} alt={name} width={24} height={24} />
      <span className='text-sm font-medium text-black'>{name}</span>
    </BoardLinkNavigation>
  )
}

function HeaderNavRecentBoardsList() {
  const { successfulData: recentBoards } = useRecentBoards()

  return (
    <div className='flex w-[224px] flex-col gap-1'>
      {recentBoards?.map((board) => <HeaderNavRecentBoardItem key={board.id} board={board} />)}
    </div>
  )
}

export default HeaderNavRecentBoardsList
