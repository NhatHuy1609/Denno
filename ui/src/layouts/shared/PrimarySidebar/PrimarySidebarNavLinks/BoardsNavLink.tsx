import React from 'react'
import Link from 'next/link'
import { MdOutlineSpaceDashboard } from 'react-icons/md'

function BoardsNavLink() {
  return (
    <Link href='' className='flex items-center gap-2'>
      <span className='block flex aspect-[1/1] w-6 items-center justify-center'>
        <MdOutlineSpaceDashboard className='text-lg text-white' />
      </span>
      <span className='text-sm text-white'>Boards</span>
    </Link>
  )
}

export default BoardsNavLink
