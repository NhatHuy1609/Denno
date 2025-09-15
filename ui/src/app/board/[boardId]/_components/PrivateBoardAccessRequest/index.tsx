import React, { useState } from 'react'
import type { CreateBoardJoinRequestDto } from '@/service/api/board/board.types'
import LockImage from 'public/lock-image.png'
import Image from 'next/image'
import LoggedInSection from './LoggedInSection'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { useMe } from '@/app/_hooks/query/user/useMe'
import { useBoardQuery } from '@/app/_hooks/query'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import useSendBoardJoinRequestMutation from '@/app/_hooks/mutation/board/useSendBoardJoinRequestMutation'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { FaRegCircleCheck } from 'react-icons/fa6'

function PrivateBoardAccessRequest() {
  const [isSentSuccessful, setIsSentSuccessful] = useState(false)
  const { data: user } = useMe()
  const [boardId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessBoard, '')
  const { data: boardData } = useBoardQuery(boardId, {
    includeJoinRequests: true
  })
  const { mutateAsync: sendBoardJoinRequestAsync, isPending } = useSendBoardJoinRequestMutation({
    onSuccess: () => {
      setIsSentSuccessful(true)
    }
  })

  // Handle send board join request
  const handleSendBoardJoinRequests = async () => {
    if (!boardId || !user) return

    const createBoardJoinRequestDto: CreateBoardJoinRequestDto = {
      requesterId: user.id
    }

    await sendBoardJoinRequestAsync({
      boardId,
      createBoardJoinRequestDto
    })
  }

  const hasSentJoinRequest =
    boardData?.joinRequests?.some(
      (joinRequest) => joinRequest.boardId === boardId && joinRequest.requester.id === user?.id
    ) || isSentSuccessful

  return (
    <div className='flex size-full items-center justify-center bg-gray-100'>
      <div className='min-w-[500px] rounded-sm bg-white p-6 shadow-md'>
        <Image src={LockImage} alt='lock-image' className='mx-auto w-[150px]' />
        {hasSentJoinRequest ? (
          <div className='flex w-full flex-col items-center gap-4'>
            <h1 className='text-center text-xl font-semibold text-black'>Request sent</h1>
            <div className='mx-auto flex items-center gap-2'>
              <span className='text-sm'>You’ll get an email if you’re approved to join.</span>
              <FaRegCircleCheck className='text-xl text-green-500' />
            </div>
          </div>
        ) : (
          <>
            <h1 className='text-center text-xl font-semibold text-black'>This board is private</h1>
            <p className='my-2 text-center text-sm'>
              Send a request to this board’s admins to get access. <br /> If you’re approved to join, you'll receive an
              email.
            </p>
            <LoggedInSection />
            <p className='my-2 text-xs text-gray-500'>
              By requesting access, you agree to share your Atlassian account information, <br /> including your email
              address, with the board admins.
            </p>

            <CustomizableButton
              intent='primary'
              className='mt-4 flex w-full items-center justify-center'
              value='Send request'
              onClick={handleSendBoardJoinRequests}
              loading={isPending}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default PrivateBoardAccessRequest
