import React from 'react'
import useAddWorkspaceMemberMutation from '@/app/_hooks/mutation/workspace/useAddWorkspaceMemberMutation'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useGuestItemContext } from '../context'
import { useQueryClient } from '@tanstack/react-query'
import { WorkspaceQueries } from '@/entities/workspace'
import { toastError, toastSuccess } from '@/ui'

type Props = {
  closePanelFn: () => void
}

function AddToWorkspacePanel({ closePanelFn }: Props) {
  const queryClient = useQueryClient()
  const workspaceId = getLocalStorageItem(PersistedStateKey.RecentAccessWorkspace)
  const { guestInfo } = useGuestItemContext()
  const { mutateAsync: addWorkspaceMemberAsync, isPending } = useAddWorkspaceMemberMutation({
    onSuccess: () => {
      closePanelFn && closePanelFn()
      toastSuccess('Guest added to workspace successfully')

      queryClient.refetchQueries({
        queryKey: WorkspaceQueries.keys.root
      })
    },
    onError: (error) => {
      toastError('Failed to add guest to workspace')
      console.error(error)
    }
  })

  const handleAddWorkspaceMember = () => {
    if (!guestInfo || isPending) return

    addWorkspaceMemberAsync({
      workspaceId,
      addWorkspaceMemberDto: {
        email: guestInfo.email,
        role: 'Normal',
        description: ''
      }
    })
  }

  return (
    <div className='w-full'>
      <h3 className='text-center text-sm font-medium text-slate-700'>Add to Workspace</h3>
      <p className='my-4 block text-sm'>Adding guest member to your Workspace.</p>
      <button
        onClick={handleAddWorkspaceMember}
        className='flex w-full items-center justify-center rounded-sm bg-blue-600 py-2 text-sm font-semibold text-white hover:opacity-80'
      >
        Add to Workspace
      </button>
    </div>
  )
}

export default AddToWorkspacePanel
