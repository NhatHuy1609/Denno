import React from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'

function WorkspaceHeaderInputSearch() {
  return (
    <div className='group relative h-full min-w-[200px] overflow-hidden rounded-md border border-black'>
      <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2'>
        <HiMagnifyingGlass />
      </span>
      <input
        placeholder='Search'
        className='w-full py-[6px] pl-8 text-sm text-slate-600 focus:outline-none group-hover:bg-gray-100'
      />
    </div>
  )
}

export default WorkspaceHeaderInputSearch
