import React, { ReactNode } from 'react'
import { cn } from '@/lib/styles/utils'
import Link from 'next/link'
import { HiHome } from 'react-icons/hi2'
import { HiTemplate, HiViewBoards } from 'react-icons/hi'
import { usePathname } from 'next/navigation'

interface NavItem {
  title: string
  icon?: ReactNode
  iconActive?: ReactNode
  href: string
}

function SidebarHomeNavItem({ item }: { item: NavItem }) {
  const pathName = usePathname()
  const { icon: IconComp, iconActive: IconActiveComp, href, title } = item

  const isActive = pathName.includes(title.toLowerCase())

  return (
    <Link
      href={href}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-3 py-[6px] hover:bg-gray-200',
        isActive && 'bg-[#e9f2ff] hover:bg-[#e9f2ff]'
      )}
    >
      {isActive ? IconActiveComp : IconComp}
      <span className={cn('text-sm font-medium text-slate-800', isActive && 'text-blue-600')}>
        {title}
      </span>
    </Link>
  )
}

function SidebarHomeNav() {
  const iconClass = 'text-sm text-gray-600'
  const iconActiveClass = 'text-sm text-blue-600'

  const navItems: NavItem[] = [
    {
      title: 'Boards',
      icon: <HiViewBoards className={iconClass} />,
      iconActive: <HiViewBoards className={iconActiveClass} />,
      href: '/'
    },
    {
      title: 'Templates',
      icon: <HiTemplate className={iconClass} />,
      iconActive: <HiTemplate className={iconActiveClass} />,
      href: '/'
    },
    {
      title: 'Home',
      icon: <HiHome className={iconClass} />,
      iconActive: <HiHome className={iconActiveClass} />,
      href: '/'
    }
  ]

  return (
    <ul className='flex list-none flex-col gap-1'>
      {navItems.map((item, index) => (
        <li key={index}>
          <SidebarHomeNavItem item={item} />
        </li>
      ))}
    </ul>
  )
}

export default SidebarHomeNav
