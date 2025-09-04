import React from 'react'
import Image from 'next/image'
import type { boardSchemas } from '@/entities/board'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useUserBoardsQuery } from '@/app/_hooks/query/user/useUserBoardsQuery'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { useToggleBoardStarredStatusMutation } from '@/app/_hooks/mutation/board/useToggleBoardStarredStatusMutation'
import { toastSuccess } from '@/ui'
import BoardLinkNavigation from '@/app/_components/BoardLinkNavigation'
import StarButton from '@/app/_components/StarButton'

function StarredBoardItem({ board }: { board: boardSchemas.Board }) {
  const [currentUserId] = useSyncedLocalStorage(PersistedStateKey.MeId)
  const { refetch } = useUserBoardsQuery(
    currentUserId,
    {
      starredBoards: true
    },
    {
      enabled: false
    }
  )

  const { id, background, name, starredStatus: isStarred } = board
  const { toggleStarBoardAsync } = useToggleBoardStarredStatusMutation({
    boardId: id,
    isStarred,
    onStarBoardSuccess: () => {
      refetch()
      toastSuccess('Board starred successfully')
    },
    onUnstarBoardSuccess: () => {
      refetch()
      toastSuccess('Board unstarred successfully')
    }
  })

  const handleClickStarButton = async () => {
    await toggleStarBoardAsync()
  }

  return (
    <div className='relative w-full cursor-pointer rounded-sm p-2 hover:bg-gray-100'>
      <BoardLinkNavigation boardId={id} className='block flex items-center gap-2'>
        <Image className='aspect-[3/2] w-8 rounded-sm' src={background} alt={name} width={24} height={24} />
        <span className='text-sm font-medium text-black'>{name}</span>
      </BoardLinkNavigation>
      <StarButton isStarred={isStarred} onClick={handleClickStarButton} className='absolute right-2 top-2' />
    </div>
  )
}

export default function HeaderNavStarredBoardsList() {
  const [currentUserId] = useSyncedLocalStorage(PersistedStateKey.MeId)
  const { data: userBoards } = useUserBoardsQuery(currentUserId, {
    starredBoards: true
  })

  const { starredBoards = [] } = userBoards || {}

  return (
    <div className='w-[224px]'>
      {starredBoards.map((board) => (
        <StarredBoardItem key={board.id} board={board} />
      ))}
    </div>
  )
}
