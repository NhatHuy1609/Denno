import React from 'react'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useDetailedWorkspaceInvitationQuery } from '@/app/_hooks/query/workspace/useDetailedWorkspaceInvitationQuery'
import CustomizableButton from '@/ui/components/CustomizableButton'

function LoggedInSection() {
  // invitationPath will have the format of workspace/{workspaceId}/{secretCode}
  const invitationPath = getLocalStorageItem(PersistedStateKey.Invitation)
  const invitationPathArray = invitationPath?.split('/') as string[]
  const [_, workspaceId, secretCode] = invitationPathArray

  const { data: invitation } = useDetailedWorkspaceInvitationQuery(workspaceId, {
    enabled: Boolean(workspaceId && secretCode),
    retry: 1
  })

  return (
    <div className='mt-10 flex w-[600px] flex-col gap-8'>
      <div className='flex w-full gap-2'>
        <h3 className='text-xl font-medium'>{invitation?.inviter.fullName}</h3>
        <p className='text-lg text-gray-500'>invited you</p>
        <h3 className='text-xl font-medium'>{invitation?.workspace.name}</h3>
      </div>

      <CustomizableButton intent='primary' value='Join Workspace' size='medium' />
    </div>
  )
}

export default LoggedInSection
