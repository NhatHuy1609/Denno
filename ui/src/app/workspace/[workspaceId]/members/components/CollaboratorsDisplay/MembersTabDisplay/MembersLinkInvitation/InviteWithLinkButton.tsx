import React, { useState } from 'react'
import { useCopyToClipboard } from '@/app/_hooks/useCopyToClipboard'
import { useCreateInvitationLink } from './useCreateInvitationLink'
import { IoIosLink } from 'react-icons/io'
import { FaRegCircleCheck } from 'react-icons/fa6'
import CustomizableButton from '@/ui/components/CustomizableButton'

type Props = {
  workspaceId: string
}

function InviteWithLinkButton({ workspaceId }: Props) {
  const [_, copy] = useCopyToClipboard()
  const [isCopiedSuccess, setIsCopiedSuccess] = useState(false)
  const { createInvitationLink, isCreatingLink } = useCreateInvitationLink(workspaceId)

  const handleClick = async () => {
    var link = await createInvitationLink()
    if (link) {
      await copy(link)
      setIsCopiedSuccess(true)

      setTimeout(() => {
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
      {isCopiedSuccess && (
        <div className='absolute right-0 top-[-30px] flex w-[200px] items-center gap-2 rounded-full bg-green-100 px-2 py-1 text-sm text-green-800'>
          <FaRegCircleCheck className='text-green-800' /> Link copied to clipboard
        </div>
      )}
    </div>
  )
}

export default InviteWithLinkButton
