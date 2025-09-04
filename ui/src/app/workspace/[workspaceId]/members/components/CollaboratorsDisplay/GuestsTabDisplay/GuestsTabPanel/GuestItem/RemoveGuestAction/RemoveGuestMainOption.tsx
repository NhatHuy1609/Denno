import React from 'react'
import MainActionItem from './MainActionItem'
import { useQueryClient } from '@tanstack/react-query'
import { toastError, toastSuccess } from '@/ui'
import { WorkspaceQueries } from '@/entities/workspace'
import { useGuestItemContext } from '../context'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import useRemoveWorkspaceGuestMutation from '@/app/_hooks/mutation/workspace/useRemoveWorkspaceGuestMutation'

function RemoveGuestMainOption() {
  const queryClient = useQueryClient()
  const { guestId } = useGuestItemContext()
  const workspaceId = getLocalStorageItem(PersistedStateKey.RecentAccessWorkspace)

  const { mutateAsync: removeWorkspaceGuestAsync, isPending } = useRemoveWorkspaceGuestMutation({
    onSuccess: () => {
      toastSuccess('Guest removed from workspace successfully')

      queryClient.refetchQueries({
        queryKey: WorkspaceQueries.keys.root
      })
    },
    onError: (error) => {
      toastError('Failed to remove guest from workspace')
      console.error(error)
    }
  })

  const handleRemoveGuest = async () => {
    if (!guestId || !workspaceId || isPending) return

    await removeWorkspaceGuestAsync({
      workspaceId,
      userId: guestId
    })
  }

  const removeGuestOptionConfig = {
    label: 'Remove Guest',
    description: 'Remove all access to the Workspace. They will receive a notification',
    onClick: handleRemoveGuest
  }

  return <MainActionItem {...removeGuestOptionConfig} />
}

export default RemoveGuestMainOption
