import React, { useEffect, useState } from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import { getErrorMessage } from '@/service/api/_getErrorMessage'
import { useRouter } from 'next/navigation'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { useWorkspaceQuery } from '@/app/_hooks/query'
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

  // Flag to check if the current user is already a member of the invited workspace
  const [isAlreadyMember, setIsAlreadyMember] = useState(false)
  // Flag to check if the invitation logic for current user is valid
  const [isCheckingInvitation, setIsCheckingInvitation] = useState(true)
  // Get the workspace data and current user data so we can check if the current user is already a member of the invited workspace
  const { data: currentUser } = useMe()
  const { data: workspaceMembers } = useWorkspaceQuery(workspaceId, {
    members: true
  })

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

  // Check if the current user is already a member of the invited workspace
  useEffect(() => {
    if (workspaceMembers && workspaceMembers.members && currentUser) {
      const isMember = workspaceMembers.members.some((member) => member.id === currentUser.id)

      if (isMember) {
        router.replace(`/workspace/${workspaceId}/members`)
        setIsAlreadyMember(true)
      }

      setIsCheckingInvitation(false)
    }
  }, [workspaceMembers, currentUser])

  const handleClickJoinWorkspace = async () => {
    await joinWorkspace(workspaceId)
  }

  if (isCheckingInvitation || isAlreadyMember) {
    return null
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
