import React from 'react'
import { cn } from '@/lib/styles/utils'
import Image from 'next/image'
import { boardSchemas } from '@/entities/board'
import { FaRegStar, FaStar } from 'react-icons/fa'
import BoardLinkNavigation from '@/app/_components/BoardLinkNavigation'
import { useToggleBoardStarredStatusMutation } from '@/app/_hooks/mutation/board/useToggleBoardStarredStatusMutation'
import { toastSuccess } from '@/ui'

interface Props {
  item: boardSchemas.Board
  onToggleStarBoard?: () => void
}

function BoardItem({ item, onToggleStarBoard }: Props) {
  const { background: backgroundSource, name, id, starredStatus: isStarred } = item

  const { toggleStarBoardAsync } = useToggleBoardStarredStatusMutation({
    boardId: id,
    isStarred,
    onStarBoardSuccess: () => {
      toastSuccess('Successfully starred the board')
      onToggleStarBoard?.()
    },
    onUnstarBoardSuccess: () => {
      toastSuccess('Successfully unstarred the board')
      onToggleStarBoard?.()
    }
  })

  return (
    <div className='group relative block min-h-24 w-full overflow-hidden rounded-md'>
      <BoardLinkNavigation boardId={id} className='absolute inset-0'>
        <div className='absolute inset-0 group-hover:brightness-90'>
          <Image width={120} height={80} alt='board image' src={backgroundSource} className='size-full object-cover' />
        </div>
        <span className='absolute left-2 top-1 block font-bold text-white'>{name}</span>
      </BoardLinkNavigation>

      <button
        type='button'
        className={cn(
          'absolute bottom-3 right-0 z-10 translate-x-4 transition-transform hover:scale-125 group-hover:-translate-x-3',
          {
            '-translate-x-3 group-hover:-translate-x-3': isStarred
          }
        )}
        onClick={toggleStarBoardAsync}
      >
        {isStarred ? (
          <FaStar className={'text-base text-amber-400'} />
        ) : (
          <FaRegStar className={'text-base text-amber-400'} />
        )}
      </button>
    </div>
  )
}

export default BoardItem
