import React, { useState } from 'react'
import TabButton from './TabButton'
import { ManagementTab } from '../types'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useBoardQuery } from '@/app/_hooks/query'

interface ManagementTabsProps {
  tabs: Array<{ title: string; key: ManagementTab }>
  activeTab: ManagementTab
  handleSelectTab: (tabKey: ManagementTab) => void
}

export default function ManagementTabs({ tabs, activeTab, handleSelectTab }: ManagementTabsProps) {
  const boardId = getLocalStorageItem(PersistedStateKey.RecentAccessBoard)
  const { data: boardData } = useBoardQuery(boardId, {
    includeBoardMembers: true,
    includeJoinRequests: true
  })

  // Take needed data from boardData to display tab's quantity
  const { members, joinRequests } = boardData || {}

  const getQuantity = (tabKey: ManagementTab) => {
    switch (tabKey) {
      case 'members':
        return members?.length || 0
      case 'requests':
        return joinRequests?.length || 0
    }
  }

  return (
    <div className='flex w-full gap-4 border-b-2 border-gray-300'>
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          title={tab.title}
          isActive={activeTab === tab.key}
          quantity={getQuantity(tab.key)}
          onClick={() => handleSelectTab(tab.key as 'members' | 'requests')}
        />
      ))}
    </div>
  )
}
