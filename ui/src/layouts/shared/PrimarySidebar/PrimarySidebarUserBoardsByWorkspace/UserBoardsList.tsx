import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useBoardsByWorkspace } from '@/app/_hooks/query'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import { boardSchemas } from '@/entities/board'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6'
import BoardLinkNavigation from '@/app/_components/BoardLinkNavigation'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'

const MAX_QUANTITY_CAN_BE_DISPLAYED = 4

function UserBoardItem({ boardItem }: { boardItem: boardSchemas.Board }) {
  const { name, background, id } = boardItem

  return (
    <BoardLinkNavigation boardId={id} className='block px-3 py-[6px] hover:bg-white/30'>
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
    </BoardLinkNavigation>
  )
}

function UserBoardsList() {
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')
  const [workspacesVisibility, setWorkspacesVisibility] = useSyncedLocalStorage(PersistedStateKey.WorkspacesVisibility)

  const { data: boards = [] } = useBoardsByWorkspace(workspaceId)

  // Get current workspace visibility settings
  const currentWorkspaceVisibility = workspacesVisibility[workspaceId] || {
    isShowMoreBoardsInSidebar: false
  }

  const [boardQuantityToDisplay, setBoardQuantityToDisplay] = useState<number>(() =>
    Math.min(boards.length, MAX_QUANTITY_CAN_BE_DISPLAYED)
  )

  // Update boardQuantityToDisplay when boards change
  useEffect(() => {
    setBoardQuantityToDisplay((prev) =>
      prev > MAX_QUANTITY_CAN_BE_DISPLAYED ? boards.length : Math.min(boards.length, MAX_QUANTITY_CAN_BE_DISPLAYED)
    )
  }, [boards])

  // Update boardQuantityToDisplay when boards or visibility settings change
  useEffect(() => {
    const shouldShowMore = currentWorkspaceVisibility.isShowMoreBoardsInSidebar

    if (shouldShowMore) {
      setBoardQuantityToDisplay(boards.length)
    } else {
      setBoardQuantityToDisplay(Math.min(boards.length, MAX_QUANTITY_CAN_BE_DISPLAYED))
    }
  }, [boards, currentWorkspaceVisibility.isShowMoreBoardsInSidebar])

  const isShowingMore = boardQuantityToDisplay > MAX_QUANTITY_CAN_BE_DISPLAYED
  const isShowMoreButton = boards.length > MAX_QUANTITY_CAN_BE_DISPLAYED && !isShowingMore
  const isShowLessButton = isShowingMore

  const handleShowMoreBoard = () => {
    setBoardQuantityToDisplay(boards.length)

    // Update visibility for workspace with id is workspaceId
    setWorkspacesVisibility((prev) => {
      const prevVisibility = prev[workspaceId]
      return {
        ...prev,
        [workspaceId]: {
          ...prevVisibility,
          isShowMoreBoardsInSidebar: true
        }
      }
    })
  }

  const handleShowLessBoard = () => {
    setBoardQuantityToDisplay(MAX_QUANTITY_CAN_BE_DISPLAYED)

    // Update visibility for workspace with id is workspaceId
    setWorkspacesVisibility((prev) => {
      const prevVisibility = prev[workspaceId]
      return {
        ...prev,
        [workspaceId]: {
          ...prevVisibility,
          isShowMoreBoardsInSidebar: false
        }
      }
    })
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
