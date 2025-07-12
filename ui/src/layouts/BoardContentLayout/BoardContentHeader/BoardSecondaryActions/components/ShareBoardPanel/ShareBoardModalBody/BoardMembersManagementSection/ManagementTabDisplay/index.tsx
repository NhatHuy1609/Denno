import React from 'react'
import { ManagementTab } from '../types'
import BoardMembersTab from './BoardMembersTab'
import BoardJoinRequestsTab from './BoardJoinRequestsTab'

interface ManagementTabDisplayProps {
  tab: ManagementTab
}

function ManagementTabDisplay({ tab }: ManagementTabDisplayProps) {
  const renderSelectedTab = () => {
    switch (tab) {
      case 'members':
        return <BoardMembersTab />
      case 'requests':
        return <BoardJoinRequestsTab />
      default:
        return null
    }
  }

  return <div className='w-full'>{renderSelectedTab()}</div>
}

export default ManagementTabDisplay
