import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMe } from '@/app/_hooks/query/user/useMe'
import AppLogo from 'public/favicon.ico'
import { HiOutlinePlus } from 'react-icons/hi'
import HeaderNav from './HeaderNav'
import { AddingList } from './HeaderNavActiveItems'
import HeaderUserActions from './HeaderUserActions'
import HeaderNavWorkspaceList from './HeaderNavWorkspaceList'
import HeaderNavRecentBoardsList from './HeaderNavRecentBoardsList'
import HeaderNavStarredBoardsList from './HeaderNavStarredBoardsList'

function PrimaryHeader() {
  const { data: { userName: currentUserName } = {} } = useMe()

  const navList = [
    { title: 'Workspaces', activeItem: <HeaderNavWorkspaceList /> },
    { title: 'Recent', activeItem: <HeaderNavRecentBoardsList /> },
    { title: 'Starred', activeItem: <HeaderNavStarredBoardsList /> },
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
        <Link
          href={`/u/${currentUserName}/boards`}
          className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-[var(--ds-button-hovered)]'
        >
          <Image src={AppLogo} alt='app-logo' className='size-5 rounded-md' />
          <span className='text-lg font-bold text-[var(--ds-text)]'>Denno</span>
        </Link>
        <HeaderNav navList={navList} />
      </div>
      <HeaderUserActions />
    </header>
  )
}

export default PrimaryHeader
