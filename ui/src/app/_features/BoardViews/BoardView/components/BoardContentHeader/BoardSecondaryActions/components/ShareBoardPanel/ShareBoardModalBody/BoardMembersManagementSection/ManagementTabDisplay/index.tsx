import React from 'react'
import BoardMembersTab from './BoardMembersTab'
import BoardJoinRequestsTab from './BoardJoinRequestsTab'
import { TabKey } from '../types'

interface ManagementTabDisplayProps {
  tab: TabKey
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
