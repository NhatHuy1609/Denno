import React, { useState } from 'react'
import ManagementTabs from './ManagementTabs'
import { ManagementTab } from './types'
import ManagementTabDisplay from './ManagementTabDisplay'

function BoardMembersManagementSection() {
  const [activeTab, setActiveTab] = useState<ManagementTab>('members')

  const tabs: Array<{ title: string; key: ManagementTab }> = [
    { title: 'Board members', key: 'members' },
    { title: 'Join requests', key: 'requests' }
  ]

  const handleSelectTab = (tabKey: ManagementTab) => {
    setActiveTab(tabKey)
  }

  return (
    <div className='mt-2 flex flex-col gap-3'>
      <ManagementTabs tabs={tabs} handleSelectTab={handleSelectTab} activeTab={activeTab} />
      <ManagementTabDisplay tab={activeTab} />
    </div>
  )
}

export default BoardMembersManagementSection
