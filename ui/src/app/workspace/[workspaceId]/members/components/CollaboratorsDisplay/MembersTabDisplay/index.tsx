import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import MembersPanel from './MembersPanel'
import MembersLinkInvitation from './MembersLinkInvitation'
import { useSignalR } from '@/app/_providers/SignalRProvider/useSignalR'
import { useMe } from '@/app/_hooks/query/user/useMe'

function MembersTabDisplay() {
  const { data: currentUser } = useMe()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: detailedWorkspace, refetch } = useWorkspaceQuery(workspaceId, {
    members: true,
    boardCounts: true
  })

  const { signalRService } = useSignalR()
  // Listening realtime events from hubs
  useEffect(() => {
    if (!signalRService) return

    const onMemberRoleChanged = () => {
      refetch()
    }

    const onWorkspaceMemberRemoved = (removedUserId: string) => {
      if (removedUserId !== currentUser?.id) refetch()
    }

    const onWorkspaceMemberLeft = (userId: string) => {
      if (userId !== currentUser?.id) {
        refetch()
      }
    }

    signalRService.on('workspace', 'OnWorkspaceMemberRoleChanged', onMemberRoleChanged)
    signalRService.on('workspace', 'OnWorkspaceMemberRemoved', onWorkspaceMemberRemoved)
    signalRService.on('workspace', 'OnWorkspaceMemberLeft', onWorkspaceMemberLeft)

    return () => {
      signalRService.off('workspace', 'OnWorkspaceMemberRoleChanged', onMemberRoleChanged)
      signalRService.off('workspace', 'OnWorkspaceMemberRemoved', onWorkspaceMemberRemoved)
      signalRService.off('workspace', 'OnWorkspaceMemberLeft', onWorkspaceMemberLeft)
    }
  }, [signalRService, refetch])

  const { members } = detailedWorkspace || {}

  return (
    <div className='w-full'>
      <div className='flex w-full flex-col gap-4 border-b border-gray-300 pb-3'>
        <h4 className='text-lg font-medium'>{`Workspace members (${members?.length})`}</h4>
        <p className='text-sm'>
          Workspace members can view and join all Workspace visible boards and create new boards in the Workspace.
        </p>
      </div>
      <MembersLinkInvitation />
      {detailedWorkspace && <MembersPanel workspace={detailedWorkspace} />}
    </div>
  )
}

export default MembersTabDisplay
