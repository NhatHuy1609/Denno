import React from 'react'
import useRemoveWorkspaceMemberMutation from '@/app/_hooks/mutation/workspace/useRemoveWorkspaceMemberMutation'
import MainActionItem from '../MainActionItem'
import RemoveMemberOptionalActions from './RemoveMemberOptionalActions'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useMemberDisplayItemContext } from '../../../context'
import { useRemoveMemberOptionsContext } from '../context'

type RemoveMemberMainActionConfig = {
  label: string
  description: string
  onClick: () => void
}

function RemoveMemberMainOption() {
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')
  const { member } = useMemberDisplayItemContext()
  const { removeRelatedBoards } = useRemoveMemberOptionsContext()

  const { mutateAsync: removeWorkspaceMemberAsync } = useRemoveWorkspaceMemberMutation({
    onError: (error) => {
      console.error(error)
    }
  })

  const handleRemoveWorkspaceMember = async () => {
    if (!workspaceId || !member) return

    await removeWorkspaceMemberAsync({
      workspaceId,
      memberId: member.id,
      removeWorkspaceMemberDto: {
        deleteRelatedBoardMembers: removeRelatedBoards
      }
    })
  }

  const actionConfig: RemoveMemberMainActionConfig = {
    label: 'Remove from workspace',
    description:
      'Remove all access to the Workspace. The member will remain on all their boards in this Workspace. They will receive a notification',
    onClick: handleRemoveWorkspaceMember
  }

  return (
    <div className='w-full'>
      <MainActionItem {...actionConfig} />
      <RemoveMemberOptionalActions />
    </div>
  )
}

export default RemoveMemberMainOption
