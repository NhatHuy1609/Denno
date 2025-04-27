import React, { useEffect, useState } from 'react'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useJoinRequestsQuery } from '@/app/_hooks/query/workspace/useJoinRequestsQuery'
import useSendJoinRequestMutation from '@/app/_hooks/mutation/workspace/useSendJoinRequestMutation'
import CustomizableButton from '@/ui/components/CustomizableButton'

function LoggedInSection() {
  const currentUserId = getLocalStorageItem(PersistedStateKey.MeId)

  // InvitationPath will have the format of workspace/{workspaceId}/{secretCode}
  const invitationPath = getLocalStorageItem(PersistedStateKey.Invitation)
  const invitationPathArray = invitationPath?.split('/') as string[]
  const [_, workspaceId] = invitationPathArray

  // Get the workspace join requests to check if the current user has already sent a join request
  const { data: workspaceJoinRequests, isLoading: isLoadingWorkspaceJoinRequests } =
    useJoinRequestsQuery(workspaceId)
  const [isWorkspaceJoinRequestSent, setIsWorkspaceJoinRequestSent] = useState(false)

  const { mutateAsync: sendJoinRequestAsync, isSuccess: isSendJoinRequestSuccess } =
    useSendJoinRequestMutation({
      onSuccess: () => {}
    })

  // Check if the current user has already sent a join request
  useEffect(() => {
    if (isLoadingWorkspaceJoinRequests) return

    if (workspaceJoinRequests) {
      const hasSentJoinRequest = workspaceJoinRequests.some(
        (joinRequest) => joinRequest.requester.id === currentUserId
      )
      setIsWorkspaceJoinRequestSent(hasSentJoinRequest)
    }
  }, [isLoadingWorkspaceJoinRequests, workspaceJoinRequests])

  if (isSendJoinRequestSuccess || isWorkspaceJoinRequestSent) {
    return (
      <div className='mt-2 w-[600px]'>
        <h3 className='mt-6 text-center text-xl font-medium'>Request Sent</h3>
        <p className='my-3 text-center text-base text-black'>
          Your request to join the Workspace was sent. You’ll get a notification if it’s approved.
        </p>
      </div>
    )
  }

  if (isLoadingWorkspaceJoinRequests) {
    return null
  }

  const handleSendJoinRequest = async () => {
    await sendJoinRequestAsync({
      workspaceId,
      createWorkspaceJoinRequestDto: {
        requesterId: currentUserId
      }
    })
  }

  return (
    <div className='mt-2 w-[600px]'>
      <h3 className='mt-6 text-center text-xl font-medium'>You can't join this Workspace</h3>
      <p className='my-3 text-center text-base'>
        The invitation link may have been disabled or this free Workspace may <br /> have reached
        the 10 collaborator limit. Try contacting the person who sent <br /> you the link for more
        info.
      </p>

      <div className='mt-6 flex justify-center'>
        <CustomizableButton
          intent='primary'
          size='medium'
          value='Request to join this workspace'
          onClick={handleSendJoinRequest}
        />
      </div>
    </div>
  )
}

export default LoggedInSection
