import React from 'react'
import type { Tabs } from './types'
import { useQueryParamState } from '@/app/_hooks/next-ui/useQueryParamState'
import CollaboratorTabs from './CollaboratorsTabs'
import MembersTabDisplay from './MembersTabDisplay'
import RequestsTabDisplay from './RequestsTabDisplay'
import GuestsTabDisplay from './RequestsTabDisplay'
import { useParams } from 'next/navigation'
import { useWorkspaceQuery } from '@/app/_hooks/query'

function CollaboratorsDisplay() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [tab, setTab] = useQueryParamState<Tabs>('tab', 'members')

  const { data: detailedWorkspace } = useWorkspaceQuery(workspaceId, {
    members: true,
    boardCounts: true
  })

  const { members } = detailedWorkspace || {}
  const collaboratorCount = members?.length || 0

  const renderTabDisplay = () => {
    if (tab === 'members') {
      return <MembersTabDisplay />
    } else if (tab === 'guests') {
      return <RequestsTabDisplay />
    } else if (tab === 'requests') {
      return <GuestsTabDisplay />
    }
  }

  return (
    <div className='w-full'>
      <h3 className='my-6 text-xl font-medium text-black'>
        Collaborators
        <span className='ml-2 rounded-lg bg-gray-100 px-2 py-1 text-sm'>
          {collaboratorCount} / 10
        </span>
      </h3>
      <div className='mt-4 flex w-full gap-6'>
        <CollaboratorTabs memberCount={members?.length} setTabFn={setTab} />
        <div className='flex-1'>{renderTabDisplay()}</div>
      </div>
    </div>
  )
}

export default CollaboratorsDisplay
