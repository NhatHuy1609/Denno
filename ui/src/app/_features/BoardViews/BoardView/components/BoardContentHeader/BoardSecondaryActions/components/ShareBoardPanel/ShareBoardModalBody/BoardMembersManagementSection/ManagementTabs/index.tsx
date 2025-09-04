import React, { useMemo } from 'react'
import TabButton from './TabButton'
import type { ManagementTabs, TabKey } from '../types'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useBoardQuery } from '@/app/_hooks/query'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { boardSchemas } from '@/entities/board'
import { useCurrentUserBoardMemberRole } from '@/store/features/board'

interface ManagementTabsProps {
  tabs: ManagementTabs
  activeTab: TabKey
  handleSelectTab: (tabKey: TabKey) => void
}

const ACCESSIBLE_TABS: {
  [key in boardSchemas.BoardMemberRole]: TabKey[]
} = {
  Admin: ['members', 'requests'],
  Member: ['members'],
  Observer: []
}

export default function ManagementTabs({ tabs, activeTab, handleSelectTab }: ManagementTabsProps) {
  const currentUserRole = useCurrentUserBoardMemberRole()

  const [boardId] = useSyncedLocalStorage<string>(PersistedStateKey.RecentAccessBoard, '')
  const { data: boardData } = useBoardQuery(boardId, {
    includeBoardMembers: true,
    includeJoinRequests: true
  })

  // Take needed data from boardData to display tab's quantity
  const { members, joinRequests } = boardData || {}

  const getQuantity = (tabKey: TabKey) => {
    switch (tabKey) {
      case 'members':
        return members?.length || 0
      case 'requests':
        return joinRequests?.length || 0
    }
  }

  const managementTabs = Object.entries(tabs).map(([tabKey, tabVal]) => tabVal)
  const availableTabTypes = useMemo(() => {
    if (!currentUserRole) return []

    return ACCESSIBLE_TABS[currentUserRole]
  }, [currentUserRole])
  // Filter tabs based on the current user's role
  const filteredTabs = managementTabs.filter((tab) => availableTabTypes.includes(tab.key as TabKey))

  return (
    <div className='flex w-full gap-4 border-b-2 border-gray-300'>
      {filteredTabs.map((tab) => (
        <TabButton
          key={tab.key}
          title={tab.title}
          isActive={activeTab === tab.key}
          quantity={getQuantity(tab.key)}
          onClick={() => handleSelectTab(tab.key as 'members' | 'requests')}
          quantityType={tab.type}
        />
      ))}
    </div>
  )
}
