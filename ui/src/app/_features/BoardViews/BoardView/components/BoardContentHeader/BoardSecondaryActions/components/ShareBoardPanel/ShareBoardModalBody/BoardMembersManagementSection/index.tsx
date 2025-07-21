import React, { useState } from 'react'
import type { ManagementTabs, TabKey } from './types'
import ManagementTabDisplay from './ManagementTabDisplay'
import ManagementTabsComp from './ManagementTabs'

const tabs: ManagementTabs = {
  members: { title: 'Board members', key: 'members', type: 'normal' },
  requests: { title: 'Join requests', key: 'requests', type: 'notification' }
}

function BoardMembersManagementSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('members')

  const handleSelectTab = (tabKey: TabKey) => {
    setActiveTab(tabKey)
  }

  return (
    <div className='mt-2 flex flex-col gap-3'>
      <ManagementTabsComp tabs={tabs} handleSelectTab={handleSelectTab} activeTab={activeTab} />
      <ManagementTabDisplay tab={activeTab} />
    </div>
  )
}

export default BoardMembersManagementSection
