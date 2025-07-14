import React from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import { toastError } from '@/ui'
import { useRouter } from 'next/navigation'
import useJoinBoardByLinkMutation from '@/app/_hooks/mutation/board/useJoinBoardByLinkMutation'
import { useDetailedBoardInvitationQuery } from '@/app/_hooks/query/board/useDetailedBoardInvitationQuery'
import CustomizableButton from '@/ui/components/CustomizableButton'

export default function LoggedInSection() {
  const router = useRouter()

  // InvitationPath for storing board invitation will have the format of board/{boardId}/{secretCode}
  const invitationPath = getLocalStorageItem(PersistedStateKey.Invitation)
  const invitationPathArray = invitationPath?.split('/') as string[]
  const [_, boardId, secretCode] = invitationPathArray

  // Get the invitation data to display the invitation details
  const { data: invitation } = useDetailedBoardInvitationQuery(boardId, {
    enabled: Boolean(boardId && secretCode),
    retry: 1
  })

  const { mutateAsync: joinBoard } = useJoinBoardByLinkMutation({
    onSuccess: () => {
      router.replace(`/board/${boardId}/members`)
    },
    onError: (error) => {
      console.error(error)
      toastError('Failed to join board. Please try again.')
    }
  })

  const handleClickJoinBoard = async () => {
    await joinBoard(boardId)
  }

  return (
    <div className='mt-10 flex w-[600px] flex-col items-center'>
      <div className='mb-8 flex w-full justify-center gap-2'>
        <h3 className='text-xl font-medium'>{invitation?.inviter.fullName}</h3>
        <p className='text-lg text-gray-500'>invited you to</p>
        <h3 className='text-xl font-medium'>{invitation?.board.name}</h3>
      </div>

      <div className='w-fit'>
        <CustomizableButton
          intent='primary'
          size='medium'
          value='Join Board'
          onClick={handleClickJoinBoard}
        />
      </div>
    </div>
  )
}
