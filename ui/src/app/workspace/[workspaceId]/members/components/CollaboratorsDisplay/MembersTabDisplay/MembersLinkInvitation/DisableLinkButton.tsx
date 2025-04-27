import useDisableInvitationSecretMutation from '@/app/_hooks/mutation/workspace/useDisableInvitationSecretMutation'
import { WorkspaceQueries } from '@/entities/workspace'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

type Props = {
  workspaceId: string
}

function DisableLinkButton({ workspaceId }: Props) {
  const queryClient = useQueryClient()

  const { mutateAsync: disableLinkAsync, isPending } = useDisableInvitationSecretMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueries.workspaceInvitationSecretQuery(workspaceId).queryKey
      })
    }
  })

  const handleClick = async () => {
    await disableLinkAsync(workspaceId)
  }

  return (
    <CustomizableButton
      onClick={handleClick}
      intent='secondary'
      value='Disable invite link'
      disabled={isPending}
    />
  )
}

export default DisableLinkButton
