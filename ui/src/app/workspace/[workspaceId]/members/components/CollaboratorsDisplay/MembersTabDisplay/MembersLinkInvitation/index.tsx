import React from 'react'
import { cn } from '@/lib/styles/utils'
import { useParams } from 'next/navigation'
import { useInvitationSecretQuery } from '@/app/_hooks/query/workspace/useWorkspaceInvitationSecretQuery'
import InviteWithLinkButton from './InviteWithLinkButton'
import DisableLinkButton from './DisableLinkButton'

export default function MembersLinkInvitation() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: invitationSecret, isError } = useInvitationSecretQuery(workspaceId, {
    retry: 0
  })

  const showDisableLinkButton = Boolean(invitationSecret?.secretCode) && !isError

  return (
    <div className='w-full py-6'>
      <h4 className='text-lg font-medium'>Invite members to join you</h4>
      <div className='mt-2 flex w-full justify-between'>
        <p
          className={cn('block w-[70%] text-sm', {
            'w-[52%]': showDisableLinkButton
          })}
        >
          Anyone with an invite link can join this free Workspace. You can also disable and create a
          new invite link for this Workspace at any time. Pending invitations count toward the 10
          collaborator limit.
        </p>
        <div className='flex h-fit justify-end gap-4'>
          {showDisableLinkButton && <DisableLinkButton workspaceId={workspaceId} />}
          <InviteWithLinkButton workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  )
}
