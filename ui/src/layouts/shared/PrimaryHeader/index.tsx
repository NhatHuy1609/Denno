import React from 'react'
import Image from 'next/image'
import AppLogo from 'public/favicon.ico'
import { HiOutlinePlus } from 'react-icons/hi'
import HeaderNav from './HeaderNav'
import { AddingList } from './HeaderNavActiveItems'
import HeaderUserActions from './HeaderUserActions'

function PrimaryHeader() {
  const navList = [
    { title: 'Workspaces', activeItem: null },
    { title: 'Recent', activeItem: null },
    { title: 'Starred', activeItem: null },
    { title: 'More', activeItem: null },
    {
      title: '',
      component: (
        <span className='block flex size-8 items-center justify-center rounded-sm bg-blue-500 hover:bg-blue-600'>
          <HiOutlinePlus className='text-xl text-white' />
        </span>
      ),
      activeItem: <AddingList />
    }
  ]

  return (
    <header
      style={{
        backdropFilter: 'blur(5px)'
      }}
      className='relative z-[2] flex max-h-[var(--header-height)] min-h-[var(--header-height)] w-full items-center justify-between border-b border-[var(--ds-border-light-transparent)] bg-[var(--ds-header-background)] px-3 py-[6px]'
    >
      <div className='flex items-center gap-2'>
        <div className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-[var(--ds-button-hovered)]'>
          <Image src={AppLogo} alt='app-logo' className='size-5 rounded-md' />
          <span className='text-lg font-bold text-[var(--ds-text)]'>Denno</span>
        </div>
        <HeaderNav navList={navList} />
      </div>
      <HeaderUserActions />
    </header>
  )
}

export default PrimaryHeader
