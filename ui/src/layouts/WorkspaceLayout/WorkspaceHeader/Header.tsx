import React from 'react'
import Image from 'next/image'
import AppLogo from 'public/favicon.ico'
import { FiBell } from 'react-icons/fi'
import { HiOutlinePlus } from 'react-icons/hi'
import WorkspaceHeaderNav from './HeaderNav'
import WorkspaceHeaderInfo from './HeaderInfo'
import WorkspaceHeaderInputSearch from './HeaderInputSearch'
import HeaderUserInfo from './HeaderUserInfo'
import { AddingList } from '../WorkspaceHeader/HeaderNavActiveItems'

function WorkspaceHeader() {
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

  const infoList = [{ component: <FiBell /> }, { component: <HeaderUserInfo /> }]

  return (
    <header className='z-10 flex max-h-[50px] min-h-[50px] w-full items-center justify-between border-b-[1px] border-gray-300 bg-white px-3 py-[6px]'>
      <div className='flex items-center gap-2'>
        <div className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-gray-200'>
          <Image src={AppLogo} alt='app-logo' className='size-5 rounded-md' />
          <span className='text-lg font-bold text-slate-600'>Denno</span>
        </div>
        <WorkspaceHeaderNav navList={navList} />
      </div>
      <div className='flex items-center gap-2'>
        <WorkspaceHeaderInputSearch />
        <WorkspaceHeaderInfo infoList={infoList} />
      </div>
    </header>
  )
}

export default WorkspaceHeader
