import React, { useEffect } from 'react'
import { useBoardQuery } from '@/app/_hooks/query'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'
import BoardMemberItem from './BoardMemberItem'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { useSignalR } from '@/app/_providers/SignalRProvider/useSignalR'
import { useWorkspaceMembersWithGuests } from './hooks/useWorkspaceMembersWithGuests'

export default function BoardMembersTab() {
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard)
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace)

  const { participantTypeMapById } = useWorkspaceMembersWithGuests(workspaceId)

  const {
    data: boardData,
    isPending,
    refetch
  } = useBoardQuery(boardId, {
    includeBoardMembers: true,
    includeJoinRequests: true
  })

  const { members } = boardData || {}

  const { signalRService } = useSignalR()

  useEffect(() => {
    if (!signalRService) return

    const handleMemberRoleChanged = () => {
      refetch()
    }

    // Sync board members data when member role changed
    signalRService.on('board', 'ReceiveMemberRoleChanged', handleMemberRoleChanged)

    return () => {
      signalRService.off('board', 'ReceiveMemberRoleChanged', handleMemberRoleChanged)
    }
  }, [signalRService])

  if (isPending) {
    return (
      <div className='flex w-full items-center justify-center p-4'>
        <WaterFallLoading />
      </div>
    )
  }

  if (!members?.length) {
    return <div className='flex w-full items-center justify-center p-4 text-lg text-gray-500'>No members found</div>
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      {members.map((member) => (
        <BoardMemberItem
          key={member.memberId}
          member={member.member}
          memberRole={member.boardMemberRole}
          workspaceParticipantType={participantTypeMapById.get(member.memberId)}
        />
      ))}
    </div>
  )
}
