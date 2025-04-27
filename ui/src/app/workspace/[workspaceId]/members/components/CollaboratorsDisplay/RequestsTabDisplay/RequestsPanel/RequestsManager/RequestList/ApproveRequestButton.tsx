import React, { use } from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import useApproveWorkspaceJoinRequest from '@/app/_hooks/mutation/joinRequest/useApproveWorkspaceJoinRequest'
import { toastError, toastSuccess } from '@/ui'

type Props = {
  requestId: number
}

function ApproveRequestButton({ requestId }: Props) {
  const { mutateAsync: approveRequestAsync, isPending } = useApproveWorkspaceJoinRequest({
    onSuccess: () => {
      toastSuccess('Successfully approved join request')
    },
    onError: (error) => {
      console.error(error)
      toastError('Failed to approve join request')
    }
  })

  const handleApproveRequest = async () => {
    await approveRequestAsync(requestId)
  }

  return (
    <CustomizableButton
      disabled={isPending}
      intent='secondary'
      size='medium'
      value='Add to workspace'
      onClick={handleApproveRequest}
    />
  )
}

export default ApproveRequestButton
