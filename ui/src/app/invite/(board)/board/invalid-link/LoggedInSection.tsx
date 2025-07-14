import React, { useEffect, useState } from 'react'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import useSendJoinRequestMutation from '@/app/_hooks/mutation/board/useSendBoardJoinRequestMutation'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { useBoardJoinRequestsQuery } from '@/app/_hooks/query/board/useBoardJoinRequestsQuery'

function LoggedInSection() {
  const currentUserId = getLocalStorageItem(PersistedStateKey.MeId)

  // InvitationPath will have the format of board/{boardId}/{secretCode}
  const invitationPath = getLocalStorageItem(PersistedStateKey.Invitation)
  const invitationPathArray = invitationPath?.split('/') as string[]
  const [_, boardId] = invitationPathArray

  // Get the board join requests to check if the current user has already sent a join request
  const { data: boardJoinRequests, isLoading: isLoadingBoardJoinRequests } =
    useBoardJoinRequestsQuery(boardId)
  const [isBoardJoinRequestSent, setIsBoardJoinRequestSent] = useState(false)

  const { mutateAsync: sendJoinRequestAsync, isSuccess: isSendJoinRequestSuccess } =
    useSendJoinRequestMutation({
      onSuccess: () => {}
    })

  // Check if the current user has already sent a join request
  useEffect(() => {
    if (isLoadingBoardJoinRequests) return

    if (boardJoinRequests) {
      const hasSentJoinRequest = boardJoinRequests.some(
        (joinRequest) => joinRequest.requester.id === currentUserId
      )
      setIsBoardJoinRequestSent(hasSentJoinRequest)
    }
  }, [isLoadingBoardJoinRequests, boardJoinRequests])

  if (isSendJoinRequestSuccess || isBoardJoinRequestSent) {
    return (
      <div className='mt-2 w-[600px]'>
        <h3 className='mt-6 text-center text-xl font-medium'>Request Sent</h3>
        <p className='my-3 text-center text-base text-black'>
          Your request to join the Board was sent. You’ll get a notification if it’s approved.
        </p>
      </div>
    )
  }

  if (isLoadingBoardJoinRequests) {
    return null
  }

  const handleSendJoinRequest = async () => {
    await sendJoinRequestAsync({
      boardId,
      createBoardJoinRequestDto: {
        requesterId: currentUserId
      }
    })
  }

  return (
    <div className='mt-2 w-[600px]'>
      <h3 className='mt-6 text-center text-xl font-medium'>You can't join this Board</h3>
      <p className='my-3 text-center text-base'>
        The invitation link may have been disabled or this free Board may <br /> have reached the 10
        collaborator limit. Try contacting the person who sent <br /> you the link for more info.
      </p>

      <div className='mt-6 flex justify-center'>
        <CustomizableButton
          intent='primary'
          size='medium'
          value='Request to join this board'
          onClick={handleSendJoinRequest}
        />
      </div>
    </div>
  )
}

export default LoggedInSection
