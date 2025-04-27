import React from 'react'
import { useRequestsManagerContext } from '../../context'
import CustomizableButton from '@/ui/components/CustomizableButton'
import useRejectMultipleWorkspaceJoinRequest from '@/app/_hooks/mutation/joinRequest/useRejectMultipleWorkspaceJoinRequest'
import { toastError, toastSuccess } from '@/ui'

function DeleteSelectedButton() {
  const { selectedRequests } = useRequestsManagerContext()
  const { mutateAsync: rejectRequestsAsync, isPending } = useRejectMultipleWorkspaceJoinRequest({
    onSuccess: () => {
      toastSuccess('Successfully rejected join requests')
    },
    onError: (error) => {
      console.error(error)
      toastError('Failed to reject join requests')
    }
  })

  const isDisabled = selectedRequests.length <= 0 || isPending

  const handleRejectSelectedRequests = async () => {
    await rejectRequestsAsync({
      requestIds: selectedRequests
    })
  }

  return (
    <CustomizableButton
      disabled={isDisabled}
      size='medium'
      intent='secondary'
      value='Delete selected requests'
      onClick={handleRejectSelectedRequests}
    />
  )
}

export default DeleteSelectedButton
