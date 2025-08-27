import React from 'react'
import Link from 'next/link'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { FaRegUser, FaPlus } from 'react-icons/fa6'
import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'
import WorkspaceInviteMemberModal from '@/app/_features/WorkspaceInviteMemberModal'

function AddMemberButton() {
  return (
    <PopoverActionWrapper
      renderTrigger={() => (
        <button
          type='button'
          className='absolute right-[-8px] top-0 flex size-6 items-center justify-center rounded-sm hover:bg-white/10'
        >
          <FaPlus className='text-sm text-white' />
        </button>
      )}
      renderContent={() => <WorkspaceInviteMemberModal />}
    />
  )
}

const MembersNavLink: React.FC = () => {
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>): false | void => {
    // Check if the click originated from the popover trigger
    const target = e.target as HTMLElement
    const popoverTrigger = target.closest('[data-radix-popper-content-wrapper], [data-radix-collection-item]')

    if (popoverTrigger || target.closest('button')) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }

  return (
    <Link
      href={`/workspace/${workspaceId}/members`}
      className='relative flex items-center gap-2'
      onClick={handleLinkClick}
    >
      <span className='block flex aspect-[1/1] w-6 items-center justify-center'>
        <FaRegUser className='-translate-y-[1px] text-sm text-white' />
      </span>
      <span className='text-sm text-white'>Members</span>
      <AddMemberButton />
    </Link>
  )
}

export default MembersNavLink
