import React from 'react'
import { LuPencil } from 'react-icons/lu'
import { MdLockOutline } from 'react-icons/md'

function WorkspaceInfoCard() {
  return (
    <div className='flex w-full items-center'>
      <div className='flex items-center gap-3'>
        <span
          style={{ backgroundImage: 'linear-gradient(green, orange)' }}
          className='block flex size-16 cursor-pointer items-center justify-center rounded-sm text-4xl font-extrabold text-white'
        >
          N
        </span>
        <div className='flex flex-col justify-center gap-1'>
          <span className='flex items-center gap-2'>
            <p className='text-xl font-semibold text-slate-800'>nhathuy</p>
            <button className='rounded-md p-[6px] hover:bg-gray-300'>
              <LuPencil className='text-sm text-gray-500' />
            </button>
          </span>
          <span className='flex items-center gap-1'>
            <MdLockOutline className='-translate-y-px text-sm text-gray-500' />
            <p className='text-xs text-gray-500'>Private</p>
          </span>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceInfoCard
