import React from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import useLeaveWorkspaceMutation from '@/app/_hooks/mutation/workspace/useLeaveWorkspaceMutation'

function LeaveBoardAction() {
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')
  const { mutateAsync: leaveWorkspaceAsync } = useLeaveWorkspaceMutation({
    onError(error) {
      console.error(error)
    }
  })

  const handleLeaveWorkspace = async () => {
    await leaveWorkspaceAsync({ workspaceId })
  }

  return (
    <div className='w-full px-4 py-2'>
      <h3 className='text-center text-sm font-medium text-slate-700'>Leave Workspace</h3>
      <p className='my-4 block text-sm'>
        You will become a guest of this workspace and will only be able to access boards you are currently a member of
      </p>
      <button
        onClick={handleLeaveWorkspace}
        className='flex w-full items-center justify-center rounded-sm bg-red-600 py-2 text-sm font-semibold text-white hover:opacity-80'
      >
        Leave Workspace
      </button>
    </div>
  )
}

export default LeaveBoardAction
