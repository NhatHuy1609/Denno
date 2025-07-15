import React from 'react'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import WorkspaceLogo from '@/app/_components/WorkspaceLogo'
import { FaAngleLeft } from 'react-icons/fa6'
import { useSyncedLocalStorage } from '@/app/_hooks/useSyncedLocalStorage'

interface IProps {
  hideSideboard: () => void
}

function PrimarySidebarHeader({ hideSideboard }: IProps) {
  const [workspaceId, setRecentAccessWorkspaceId] = useSyncedLocalStorage(
    PersistedStateKey.RecentAccessWorkspace,
    ''
  )
  const { data: workspace } = useWorkspaceQuery(workspaceId as string)

  const { name = '', logo } = workspace || {}

  const handleClickToHideSideboard = () => {
    hideSideboard()
  }

  return (
    <div className='flex h-[var(--primary-sidebar-header-height)] items-center justify-between border-b border-[var(--ds-border-light-transparent)] p-3'>
      <div className='flex items-center gap-2'>
        <WorkspaceLogo name={name} imageUrl={logo} size='base' />
        <div className='flex flex-col'>
          <span className='text-sm font-semibold text-white'>{name}</span>
          <span className='text-xs font-light text-white'>Free</span>
        </div>
      </div>
      <button
        type='button'
        className='rounded-md p-2 transition hover:bg-white/20'
        onClick={handleClickToHideSideboard}
      >
        <FaAngleLeft className='text-sm' />
      </button>
    </div>
  )
}

export default PrimarySidebarHeader
