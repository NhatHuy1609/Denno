import React from 'react'
import Link from 'next/link'
import { LinkProps } from 'next/link'
import { setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useSyncedLocalStorage } from '../_hooks/useSyncedLocalStorage'

type Props = Omit<LinkProps, 'href'> & {
  boardId: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

function BoardLinkNavigation({ className, children, boardId, onClick, ...props }: Props) {
  const [recentBoards, setRecentBoards] = useSyncedLocalStorage(PersistedStateKey.RecentBoards)

  const onClickBoardLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (boardId) {
      // Store current accessed boardId
      setLocalStorageItem(PersistedStateKey.RecentAccessBoard, boardId)

      // Update recentBoards list
      const now = new Date().toISOString()
      const updatedBoards = [
        { id: boardId, accessTime: now },
        ...(recentBoards ?? []).filter((b) => b.id !== boardId)
      ].slice(0, 10)

      setTimeout(() => {
        setRecentBoards(updatedBoards)
      }, 3000)
    }

    onClick && onClick()
  }

  return (
    <Link onClick={onClickBoardLink} href={`/board/${boardId}`} className={className}>
      {children}
    </Link>
  )
}

export default BoardLinkNavigation
