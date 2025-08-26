import React, { use } from 'react'
import { useJoinRequestsQuery } from '@/app/_hooks/query/workspace/useJoinRequestsQuery'
import { useParams } from 'next/navigation'
import RequestsPanel from './RequestsPanel'

function RequestsTabDisplay() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: workspaceJoinRequests } = useJoinRequestsQuery(workspaceId)

  return (
    <div className='w-full'>
      <div className='flex w-full flex-col gap-4 border-b border-gray-300 py-3'>
        <h4 className='text-lg font-medium'>{`Workspace members (${workspaceJoinRequests?.length})`}</h4>
        <p className='text-sm'>
          These people have requested to join this Workspace. Adding new Workspace members will automatically update
          your bill. Workspace guests already count toward the free Workspace collaborator limit.
        </p>
      </div>
      <RequestsPanel />
    </div>
  )
}

export default RequestsTabDisplay
