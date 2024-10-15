import React, { ReactNode } from 'react'
import Link from 'next/link'
import { HiHome } from 'react-icons/hi2'
import { HiTemplate, HiViewBoards } from 'react-icons/hi'

interface NavItem {
  title: string
  icon?: ReactNode
  href: string
}

function SidebarHomeNavItem({ item }: { item: NavItem }) {
  const { icon: IconComp, href, title } = item

  return (
    <Link
      href={href}
      className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-[6px] hover:bg-gray-200'
    >
      {IconComp}
      <span className='text-sm font-medium text-slate-800'>{title}</span>
    </Link>
  )
}

function SidebarHomeNav() {
  const iconClass = 'text-sm text-gray-600'

  const navItems: NavItem[] = [
    {
      title: 'Boards',
      icon: <HiViewBoards className={iconClass} />,
      href: '/'
    },
    {
      title: 'Templates',
      icon: <HiTemplate className={iconClass} />,
      href: '/'
    },
    { title: 'Home', icon: <HiHome className={iconClass} />, href: '/' }
  ]

  return (
    <ul className='flex list-none flex-col gap-2'>
      {navItems.map((item, index) => (
        <li key={index}>
          <SidebarHomeNavItem item={item} />
        </li>
      ))}
    </ul>
  )
}

export default SidebarHomeNav
