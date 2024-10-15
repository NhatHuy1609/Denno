import React, { useState } from 'react'
import { cn } from '@/lib/styles/utils'
import { Popover } from '@/ui'
import { LiaAngleDownSolid } from 'react-icons/lia'

interface IHeaderNavItemProps {
  title: string
  component?: React.ReactNode
  activeItem: React.ReactElement | null
}

function HeaderNavItem({ item }: { item: IHeaderNavItemProps }) {
  const { component, title, activeItem: ActiveComp } = item
  const [isActive, setActive] = useState(false)

  const handleToggleActiveItem = (isOpen: boolean) => {
    setActive(isOpen)
  }

  const TriggerComp = title ? (
    <div
      className={cn(
        `vertical-align inline-flex cursor-pointer items-center gap-2 rounded-sm px-3 py-[6px] hover:bg-gray-200`,
        isActive && 'bg-blue-200 text-blue-600 hover:bg-blue-200'
      )}
    >
      <span
        className={cn(
          'select-none text-sm font-medium text-slate-600',
          isActive && 'text-blue-600'
        )}
      >
        {item.title}
      </span>
      <LiaAngleDownSolid className='-translate-y-[2px] text-sm font-bold' />
    </div>
  ) : (
    component
  )

  return (
    <Popover.Popover onOpenChange={handleToggleActiveItem}>
      <Popover.Trigger>{TriggerComp}</Popover.Trigger>
      <Popover.Content align='start' className='w-auto px-2 py-3'>
        {ActiveComp}
      </Popover.Content>
    </Popover.Popover>
  )
}

function WorkspaceHeaderNav({ navList }: { navList: IHeaderNavItemProps[] }) {
  return (
    <div className='flex list-none items-center gap-1'>
      {navList.map((navItem, index) => (
        <HeaderNavItem item={navItem} key={index} />
      ))}
    </div>
  )
}

export default WorkspaceHeaderNav
