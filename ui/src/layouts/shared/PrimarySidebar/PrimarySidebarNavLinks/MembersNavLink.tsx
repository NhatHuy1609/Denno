import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import Link from 'next/link'
import React from 'react'
import { FaRegUser, FaPlus } from 'react-icons/fa6'

function AddMemberButton() {
  return (
    <button
      type='button'
      className='absolute right-[-8px] top-0 flex size-6 items-center justify-center rounded-sm hover:bg-white/10'
    >
      <FaPlus className='text-sm text-white' />
    </button>
  )
}

function MembersNavLink() {
  const workspaceId = getLocalStorageItem(PersistedStateKey.RecentAccessWorkspace)

  return (
    <Link href={`/workspace/${workspaceId}/members`} className='relative flex items-center gap-2'>
      <span className='block flex aspect-[1/1] w-6 items-center justify-center'>
        <FaRegUser className='-translate-y-[1px] text-sm text-white' />
      </span>
      <span className='text-sm text-white'>Members</span>
      <AddMemberButton />
    </Link>
  )
}

export default MembersNavLink
