import React from 'react'
import { useParams } from 'next/navigation'
import { LuPencil } from 'react-icons/lu'
import { MdLockOutline } from 'react-icons/md'
import WorkspaceInfoLogo from './WorkspaceInfoLogo'
import { useWorkspaceQuery } from '@/app/_hooks/query'

function WorkspaceInfoDetail({
  name = '',
  visibility,
  onClickShowUpdateForm
}: {
  name?: string
  visibility?: string
  onClickShowUpdateForm: () => void
}) {
  return (
    <div className='flex flex-col justify-center gap-1'>
      <span className='flex items-center gap-2'>
        <p className='text-xl font-semibold text-slate-800'>{name}</p>
        <button className='rounded-md p-[6px] hover:bg-gray-300' onClick={onClickShowUpdateForm}>
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

function WorkspaceInfoCard({
  setShowWorkspaceUpdateForm,
  showDescription = true
}: {
  setShowWorkspaceUpdateForm: React.Dispatch<React.SetStateAction<boolean>>
  showDescription?: boolean
}) {
  const { workspaceId } = useParams()
  const { data } = useWorkspaceQuery(workspaceId as string)

  const { logoUrl = '', name, description, visibility } = data || {}

  const handleShowUpdateWorkspaceForm = () => {
    setShowWorkspaceUpdateForm(true)
  }

  return (
    <div className='w-full'>
      <div className='flex items-center gap-3'>
        <WorkspaceInfoLogo logoUrl={logoUrl} name={name} />
        <WorkspaceInfoDetail
          name={name}
          visibility={visibility}
          onClickShowUpdateForm={handleShowUpdateWorkspaceForm}
        />
      </div>
      {showDescription && (
        <div className='mt-4 w-full'>
          <h4 className='mb-1 text-sm font-medium text-blue-500'>Description:</h4>
          <p className='text-sm text-gray-500'>{description}</p>
        </div>
      )}
    </div>
  )
}

export default WorkspaceInfoCard
