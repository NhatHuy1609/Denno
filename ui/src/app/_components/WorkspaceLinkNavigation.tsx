import React from 'react'
import Link from 'next/link'
import { LinkProps } from 'next/link'
import { setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'

type Props = Omit<LinkProps, 'href'> & {
  workspaceId: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

function WorkspaceLinkNavigation({ className, children, workspaceId, onClick, ...props }: Props) {
  const onClickWorkspaceLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (workspaceId) {
      // Store current accessed boardId
      setLocalStorageItem(PersistedStateKey.RecentAccessWorkspace, workspaceId)
    }

    onClick && onClick()
  }

  return (
    <Link onClick={onClickWorkspaceLink} href={`/workspace/${workspaceId}/home`} className={className}>
      {children}
    </Link>
  )
}

export default WorkspaceLinkNavigation
