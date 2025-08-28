import React from 'react'
import Link from 'next/link'
import { LinkProps } from 'next/link'
import { setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

type Props = Omit<LinkProps, 'href'> & {
  boardId: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

function BoardLinkNavigation({ className, children, boardId, onClick, ...props }: Props) {
  const onClickBoardLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (boardId) {
      setLocalStorageItem(PersistedStateKey.RecentAccessBoard, boardId)
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
