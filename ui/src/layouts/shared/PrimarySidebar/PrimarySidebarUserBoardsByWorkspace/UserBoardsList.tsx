import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useBoardsByWorkspace } from '@/app/_hooks/query'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import { boardTypes } from '@/entities/board'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6'

const MAX_QUANTITY_CAN_BE_DISPLAYED = 4

function UserBoardItem({ boardItem }: { boardItem: boardTypes.Board }) {
  const { name, background, id } = boardItem

  return (
    <Link href={`/board/${id}`} className='block px-3 py-[6px] hover:bg-white/30'>
      <div className='flex items-center gap-2'>
        <Image
          src={background}
          width={28}
          height={20}
          alt='board background'
          className='aspect-[4/3] w-[28px] rounded-[2px] border border-white/10'
        />
        <span className='text-[13px] text-white'>{name}</span>
      </div>
    </Link>
  )
}

function UserBoardsList() {
  const workspaceId = getLocalStorageItem(PersistedStateKey.RecentAccessWorkspace) as string
  const { data: boards = [] } = useBoardsByWorkspace(workspaceId)

  const [boardQuantityToDisplay, setBoardQuantityToDisplay] = useState<number>(() =>
    Math.min(boards.length, MAX_QUANTITY_CAN_BE_DISPLAYED)
  )

  const isShowMoreButton =
    boardQuantityToDisplay < Math.max(MAX_QUANTITY_CAN_BE_DISPLAYED, boards.length)
  const isShowLessButton = !isShowMoreButton

  const handleShowMoreBoard = () => {
    setBoardQuantityToDisplay(boards.length)
  }

  const handleShowLessBoard = () => {
    setBoardQuantityToDisplay(MAX_QUANTITY_CAN_BE_DISPLAYED)
  }

  return (
    <div className='my-2 w-full'>
      <ul className='flex w-full list-none flex-col'>
        {boards.slice(0, boardQuantityToDisplay).map((boardItem) => (
          <li key={boardItem?.id}>
            <UserBoardItem boardItem={boardItem} />
          </li>
        ))}
      </ul>
      {isShowMoreButton && (
        <button
          type='button'
          onClick={handleShowMoreBoard}
          className='mt-1 flex w-full items-center justify-between px-2 py-1 hover:bg-white/20'
        >
          <div className='flex items-center gap-2'>
            <FaAngleDown />
            <span className='text-sm text-white'>Show more</span>
          </div>
          <span className='block flex size-6 items-center justify-center rounded-full bg-white/40 text-xs text-white'>
            {Math.max(MAX_QUANTITY_CAN_BE_DISPLAYED, boards.length) - boardQuantityToDisplay}
          </span>
        </button>
      )}

      {isShowLessButton && (
        <button
          type='button'
          onClick={handleShowLessBoard}
          className='mt-1 flex w-full items-center justify-between px-2 py-1 hover:bg-white/20'
        >
          <div className='flex items-center gap-2'>
            <FaAngleUp />
            <span className='text-sm text-white'>Show less</span>
          </div>
        </button>
      )}
    </div>
  )
}

export default UserBoardsList
