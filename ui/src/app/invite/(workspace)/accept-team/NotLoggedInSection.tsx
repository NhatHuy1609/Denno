import React from 'react'
import Link from 'next/link'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useDetailedWorkspaceInvitationQuery } from '@/app/_hooks/query/workspace/useDetailedWorkspaceInvitationQuery'

function NotLoggedInSection() {
  // InvitationPath will have the format of workspace/{workspaceId}/{secretCode}
  const invitationPath = getLocalStorageItem(PersistedStateKey.Invitation)
  const invitationPathArray = invitationPath?.split('/') as string[]
  const [_, workspaceId, secretCode] = invitationPathArray

  // Get the invitation data to display the invitation details
  const { data: invitation } = useDetailedWorkspaceInvitationQuery(workspaceId, {
    enabled: Boolean(workspaceId && secretCode),
    retry: 1
  })

  const handleClickLink = () => {
    setLocalStorageItem(
      PersistedStateKey.RedirectAfterLogin,
      `/invite/${workspaceId}/${secretCode}`
    )
  }

  return (
    <div className='mt-10 flex w-[600px] flex-col items-center'>
      <div className='mb-8 flex w-full justify-center gap-2'>
        <h3 className='text-xl font-medium'>{invitation?.inviter.fullName}</h3>
        <p className='text-lg text-gray-500'>invited you to</p>
        <h3 className='text-xl font-medium'>{invitation?.workspace.name}</h3>
      </div>

      <p className='text-sm'>
        Looks like you need to be logged into your Denno account to join this Workspace.
      </p>

      <div className='mt-4 flex w-full justify-center gap-6'>
        <Link
          href='/sign-up'
          onClick={handleClickLink}
          className='min-w-[200px] rounded-md bg-gray-200 p-2 text-center text-lg font-semibold text-black hover:opacity-80'
        >
          Sign up
        </Link>
        <Link
          href='/sign-in'
          onClick={handleClickLink}
          className='min-w-[200px] rounded-md bg-blue-500 p-2 text-center text-lg font-semibold text-white hover:opacity-80'
        >
          Login
        </Link>
      </div>
    </div>
  )
}

export default NotLoggedInSection
