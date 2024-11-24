import React from 'react'
import Link from 'next/link'
import { FaTableList } from 'react-icons/fa6'

function TableViewNavLink() {
  return (
    <Link href='' className='relative flex items-center gap-2'>
      <span className='block flex aspect-[1/1] w-6 items-center justify-center'>
        <FaTableList className='-translate-y-[1px] text-sm text-white' />
      </span>
      <span className='text-sm text-white'>Table</span>
    </Link>
  )
}

export default TableViewNavLink
