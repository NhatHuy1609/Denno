import React, { useRef, useState } from 'react'
import { useCopyToClipboard } from '@/app/_hooks/useCopyToClipboard'
import { useCreateInvitationLink } from '../../../../../../../_hooks/useCreateInvitationLink'
import { IoIosLink } from 'react-icons/io'
import { FaRegCircleCheck } from 'react-icons/fa6'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { useQueryClient } from '@tanstack/react-query'
import { WorkspaceQueries } from '@/entities/workspace'

type Props = {
  workspaceId: string
}

function InviteWithLinkButton({ workspaceId }: Props) {
  const queryClient = useQueryClient()

  const [_, copy] = useCopyToClipboard()
  const [isCopiedSuccess, setIsCopiedSuccess] = useState(false)
  const { createInvitationLink, isCreatingLink } = useCreateInvitationLink(workspaceId)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = async () => {
    var link = await createInvitationLink()
    if (link) {
      await copy(link)
      setIsCopiedSuccess(true)

      // Invalidate the query to refresh the invitation secret
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueries.workspaceInvitationSecretQuery(workspaceId).queryKey
      })

      // Clear the timeout if it exists before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // This ensures that the copied state is reset after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsCopiedSuccess(false)
      }, 2000)
    }
  }

  return (
    <div className='relative size-fit'>
      <CustomizableButton
        onClick={handleClick}
        intent='secondary'
        value='Invite with link'
        disabled={isCreatingLink}
        startIcon={<IoIosLink className='tex-base' />}
      />
      {!isCreatingLink && isCopiedSuccess && (
        <div className='absolute right-0 top-[-35px] flex w-[200px] items-center gap-2 rounded-full bg-green-100 px-2 py-1 text-sm text-green-800'>
          <FaRegCircleCheck className='text-green-800' /> Link copied to clipboard
        </div>
      )}
    </div>
  )
}

export default InviteWithLinkButton
