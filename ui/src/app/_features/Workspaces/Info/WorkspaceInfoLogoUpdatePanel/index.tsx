import React from 'react'
import { useParams } from 'next/navigation'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import { HiOutlineXMark } from 'react-icons/hi2'
import UploadLogoButton from './UploadLogoButton'
import RemoveLogoButton from './RemoveLogoButton'

function WorkspaceInfoLogoUpdatePanel({
  onClickClosePopover
}: {
  onClickClosePopover: () => void
}) {
  const { workspaceId } = useParams()
  const { data: workspace } = useWorkspaceQuery(workspaceId as string)

  return (
    <div className='relative'>
      <div className='relative flex w-full items-center justify-center'>
        <span className='block w-full text-center text-sm font-medium text-gray-800'>
          Change logo
        </span>
        <button
          type='button'
          onClick={onClickClosePopover}
          className='absolute right-0 top-0 -translate-y-2 translate-x-1 rounded-md p-2 hover:bg-gray-200'
        >
          <HiOutlineXMark className='text-base' />
        </button>
      </div>

      <div className='mt-4 flex w-full flex-col gap-3'>
        <UploadLogoButton />
        {workspace?.logo && <RemoveLogoButton />}
      </div>
    </div>
  )
}

export default WorkspaceInfoLogoUpdatePanel
