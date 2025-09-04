// Cài đặt: npm install path-to-regexp@^6.0.0

import React, { ReactNode } from 'react'
import { cn } from '@/lib/styles/utils'
import Link from 'next/link'
import { HiViewBoards } from 'react-icons/hi'
import { usePathname } from 'next/navigation'
import { match } from 'path-to-regexp' // ✅ dùng match thay vì pathToRegexp
import { useMe } from '@/app/_hooks/query/user/useMe'

interface NavItem {
  title: string
  icon: ReactNode
  href: string
  matchPath: string
}

function SidebarHomeNavItem({ item }: { item: NavItem }) {
  const pathName = usePathname()
  const { icon, href, title, matchPath } = item

  // Create matcher function to check if current path matches
  const matcher = match(matchPath, { decode: decodeURIComponent })
  const isActive = matcher(pathName) !== false

  return (
    <Link
      href={href}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-3 py-[6px] hover:bg-gray-200',
        isActive && 'bg-[#e9f2ff] hover:bg-[#e9f2ff]'
      )}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: cn('text-sm', isActive ? 'text-blue-600' : 'text-gray-600')
      })}
      <span className={cn('text-sm font-medium text-slate-800', isActive && 'text-blue-600')}>{title}</span>
    </Link>
  )
}

function SidebarHomeNav() {
  const { data: { userName: currentUserName } = {} } = useMe()

  const navItems: NavItem[] = [
    {
      title: 'Boards',
      icon: <HiViewBoards />,
      href: `/u/${currentUserName}/boards`,
      matchPath: '/u/:userName/boards'
    }
  ]

  return (
    <ul className='flex list-none flex-col gap-1'>
      {navItems.map((item) => (
        <li key={item.title}>
          <SidebarHomeNavItem item={item} />
        </li>
      ))}
    </ul>
  )
}

export default SidebarHomeNav
