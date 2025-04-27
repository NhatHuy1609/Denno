import React from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { useRequestsManagerContext } from '../../context'
import useApproveMultipleWorkspaceJoinRequest from '@/app/_hooks/mutation/joinRequest/useApproveMultipleWorkspaceJoinRequest'
import { toastSuccess, toastError } from '@/ui'

function AddSelectedButton() {
  const { selectedRequests } = useRequestsManagerContext()
  const { mutateAsync: approveRequestsAsync, isPending } = useApproveMultipleWorkspaceJoinRequest({
    onSuccess: () => {
      toastSuccess('Successfully approved join requests')
    },
    onError: (error) => {
      console.error(error)
      toastError('Failed to approve join requests')
    }
  })

  const isDisabled = selectedRequests.length <= 0 || isPending

  const handleApproveSelectedRequests = async () => {
    await approveRequestsAsync({
      requestIds: selectedRequests
    })
  }

  return (
    <CustomizableButton
      disabled={isDisabled}
      size='medium'
      intent='primary'
      value='Add selected to Workspace'
      onClick={handleApproveSelectedRequests}
    />
  )
}

export default AddSelectedButton
