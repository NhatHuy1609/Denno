import React from 'react'
import Link from 'next/link'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { FaRegUser, FaPlus } from 'react-icons/fa6'
import WorkspaceInviteMemberModal from '@/app/_features/WorkspaceInviteMemberModal'

function AddMemberButton() {
  return (
    <WorkspaceInviteMemberModal
      renderTrigger={() => (
        <button
          type='button'
          className='absolute right-[-8px] top-0 flex size-6 items-center justify-center rounded-sm hover:bg-white/10'
        >
          <FaPlus className='text-sm text-white' />
        </button>
      )}
    />
  )
}
const MembersNavLink: React.FC = () => {
  const [workspaceId] = useSyncedLocalStorage(PersistedStateKey.RecentAccessWorkspace, '')

  return (
    <div className='relative w-full'>
      <Link href={`/workspace/${workspaceId}/members`} className='relative flex items-center gap-2'>
        <span className='block flex aspect-[1/1] w-6 items-center justify-center'>
          <FaRegUser className='-translate-y-[1px] text-sm text-white' />
        </span>
        <span className='text-sm text-white'>Members</span>
      </Link>
      <div className='absolute right-0 top-0'>
        <AddMemberButton />
      </div>
    </div>
  )
}

export default MembersNavLink
