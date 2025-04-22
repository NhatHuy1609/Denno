import React from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import { useRouter } from 'next/navigation'
import useJoinWorkspaceByLinkMutation from '@/app/_hooks/mutation/workspace/useJoinWorkspaceByLinkMutation'
import { useDetailedWorkspaceInvitationQuery } from '@/app/_hooks/query/workspace/useDetailedWorkspaceInvitationQuery'
import { toastError } from '@/ui'
import CustomizableButton from '@/ui/components/CustomizableButton'

export default function LoggedInSection() {
  const router = useRouter()

  // InvitationPath will have the format of workspace/{workspaceId}/{secretCode}
  const invitationPath = getLocalStorageItem(PersistedStateKey.Invitation)
  const invitationPathArray = invitationPath?.split('/') as string[]
  const [_, workspaceId, secretCode] = invitationPathArray

  // Get the invitation data to display the invitation details
  const { data: invitation } = useDetailedWorkspaceInvitationQuery(workspaceId, {
    enabled: Boolean(workspaceId && secretCode),
    retry: 1
  })

  const { mutateAsync: joinWorkspace } = useJoinWorkspaceByLinkMutation({
    onSuccess: () => {
      router.replace(`/workspace/${workspaceId}/members`)
    },
    onError: (error) => {
      toastError('Failed to join workspace. Please try again.')
    }
  })

  const handleClickJoinWorkspace = async () => {
    await joinWorkspace(workspaceId)
  }

  return (
    <div className='mt-10 flex w-[600px] flex-col items-center'>
      <div className='mb-8 flex w-full justify-center gap-2'>
        <h3 className='text-xl font-medium'>{invitation?.inviter.fullName}</h3>
        <p className='text-lg text-gray-500'>invited you to</p>
        <h3 className='text-xl font-medium'>{invitation?.workspace.name}</h3>
      </div>

      <div className='w-fit'>
        <CustomizableButton
          intent='primary'
          size='medium'
          value='Join Workspace'
          onClick={handleClickJoinWorkspace}
        />
      </div>
    </div>
  )
}
