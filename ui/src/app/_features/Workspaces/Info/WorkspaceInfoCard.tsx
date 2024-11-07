import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { WorkspaceQueries } from '@/entities/workspace'
import { LuPencil } from 'react-icons/lu'
import { MdLockOutline } from 'react-icons/md'
import WorkspaceLogo from '@/app/_components/WorkspaceLogo'

function WorkspaceInfoLogo({ logoUrl = '', name = '' }: { logoUrl?: string; name?: string }) {
  return (
    <div className='group relative cursor-pointer'>
      <WorkspaceLogo size='lg' imageUrl={logoUrl} name={name} />
      <div className='absolute bottom-0 hidden w-full bg-[rgba(0,0,0,0.2)] py-1 group-hover:block'>
        <span className='text-whit block w-full text-center text-sm font-semibold text-white underline'>
          Change
        </span>
      </div>
    </div>
  )
}

function WorkspaceInfoDetail({ name = '', visibility }: { name?: string; visibility?: string }) {
  return (
    <div className='flex flex-col justify-center gap-1'>
      <span className='flex items-center gap-2'>
        <p className='text-xl font-semibold text-slate-800'>{name}</p>
        <button className='rounded-md p-[6px] hover:bg-gray-300'>
          <LuPencil className='text-sm text-gray-500' />
        </button>
      </span>
      <span className='flex items-center gap-1'>
        <MdLockOutline className='-translate-y-px text-sm text-gray-500' />
        <p className='text-xs text-gray-500'>{visibility}</p>
      </span>
    </div>
  )
}

function WorkspaceInfoCard() {
  const { workspaceId } = useParams()
  const { data } = useQuery(WorkspaceQueries.workspaceQuery(workspaceId as string))

  const { logoUrl, name, visibility } = data || {}

  return (
    <div className='flex w-full items-center'>
      <div className='flex items-center gap-3'>
        <WorkspaceInfoLogo logoUrl={logoUrl} name={name} />
        <WorkspaceInfoDetail name={name} visibility={visibility} />
      </div>
    </div>
  )
}

export default WorkspaceInfoCard
