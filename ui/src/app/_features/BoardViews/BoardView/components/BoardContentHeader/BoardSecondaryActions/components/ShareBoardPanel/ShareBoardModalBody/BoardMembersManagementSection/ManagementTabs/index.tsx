import React from 'react'
import TabButton from './TabButton'
import type { ManagementTabs, TabKey } from '../types'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useBoardQuery } from '@/app/_hooks/query'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'

interface ManagementTabsProps {
  tabs: ManagementTabs
  activeTab: TabKey
  handleSelectTab: (tabKey: TabKey) => void
}

export default function ManagementTabs({ tabs, activeTab, handleSelectTab }: ManagementTabsProps) {
  const [boardId, setRecentAccessBoardId] = useSyncedLocalStorage<string>(
    PersistedStateKey.RecentAccessBoard,
    ''
  )
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

  return (
    <div className='flex w-full gap-4 border-b-2 border-gray-300'>
      {managementTabs.map((tab) => (
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
