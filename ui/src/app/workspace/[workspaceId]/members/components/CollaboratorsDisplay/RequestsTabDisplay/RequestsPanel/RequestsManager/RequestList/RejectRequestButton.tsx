import React from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'
import CustomizableButton from '@/ui/components/CustomizableButton'
import useRejectWorkspaceJoinRequest from '@/app/_hooks/mutation/joinRequest/useRejectWorkspaceJoinRequest'
import { toastError, toastSuccess } from '@/ui'

type Props = {
  requestId: number
}

function RejectRequestButton({ requestId }: Props) {
  const { mutateAsync: rejectRequestAsync, isPending } = useRejectWorkspaceJoinRequest({
    onSuccess: () => {
      toastSuccess('Successfully rejected join request')
    },
    onError: (error) => {
      console.error(error)
      toastError('Failed to reject join request')
    }
  })

  const handleRejectRequest = async () => {
    await rejectRequestAsync(requestId)
  }

  return (
    <CustomizableButton
      intent='icon'
      disabled={isPending}
      className='h-8 rounded-sm bg-white text-black hover:bg-gray-200'
      startIcon={<HiOutlineXMark className='text-lg font-medium' />}
      onClick={handleRejectRequest}
    />
  )
}

export default RejectRequestButton
