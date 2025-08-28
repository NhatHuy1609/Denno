import React from 'react'
import GuestsTabPanel from './GuestsTabPanel'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { useWorkspaceQuery } from '@/app/_hooks/query'

function GuestsTabDisplay() {
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')
  const { data: workspace } = useWorkspaceQuery(workspaceId, {
    includeGuests: true
  })

  return (
    <div className='w-full'>
      <div className='flex w-full flex-col gap-4 border-b border-gray-300 pb-3'>
        <h4 className='text-lg font-medium'>{`Guests (${workspace?.guests.length || 0})`}</h4>
        <p className='text-sm'>Guests can only view and edit the boards to which they've been added.</p>
      </div>
      <GuestsTabPanel guests={workspace?.guests || []} />
    </div>
  )
}

export default GuestsTabDisplay
