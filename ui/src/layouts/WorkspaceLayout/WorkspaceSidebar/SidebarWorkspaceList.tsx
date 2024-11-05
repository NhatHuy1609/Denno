import React, { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query/query-client'
import { WorkspaceQueries } from '@/entities/workspace/workspace.queries'
import { LiaAngleDownSolid } from 'react-icons/lia'
import { HiViewBoards } from 'react-icons/hi'
import { FaRegHeart } from 'react-icons/fa6'
import { LuUsers } from 'react-icons/lu'
import { MdOutlineGridView } from 'react-icons/md'
import { IoIosSettings } from 'react-icons/io'
import { Collapsible } from '@/ui'
import WorkspaceLogo from '@/app/_components/WorkspaceLogo'
import { workspaceTypes } from '@/entities/workspace'

interface IWorkspaceSubItem {
  title: string
  icon: ReactNode
  href: string
}

function SidebarWorkspaceSubContent({ workspaceId }: { workspaceId: string }) {
  const iconClass = 'text-sm text-slate-600'

  const items: IWorkspaceSubItem[] = [
    {
      title: 'Boards',
      icon: <HiViewBoards className={iconClass} />,
      href: `/w/${workspaceId}/home`
    },
    {
      title: 'Highlights',
      icon: <FaRegHeart className={iconClass} />,
      href: '/'
    },
    {
      title: 'Views',
      icon: <MdOutlineGridView className={iconClass} />,
      href: ''
    },
    {
      title: 'Members',
      icon: <LuUsers className={iconClass} />,
      href: '/'
    },
    {
      title: 'Settings',
      icon: <IoIosSettings className={iconClass} />,
      href: '/'
    }
  ]

  return (
    <div className='mt-1 flex flex-col gap-[2px]'>
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className='flex cursor-pointer items-center gap-2 rounded-md py-2 pl-10 pr-2 hover:bg-gray-200'
        >
          {item.icon}
          <span className='text-[13px] font-medium text-slate-600'>{item.title}</span>
        </Link>
      ))}
    </div>
  )
}

function SidebarWorkspaceItem({ workspace }: { workspace: workspaceTypes.Workspace }) {
  const { id, name, logoUrl } = workspace

  return (
    <Collapsible.Collapsible>
      <Collapsible.Trigger className='w-full'>
        <div className='flex cursor-pointer items-center justify-between rounded-md p-2 pr-4 hover:bg-gray-200'>
          <div className='flex items-center gap-2'>
            <WorkspaceLogo name={name} imageUrl={logoUrl} size='sm' />
            <span className='text-sm font-semibold text-slate-700'>{name}</span>
          </div>
          <LiaAngleDownSolid className='-translate-y-px text-sm' />
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <SidebarWorkspaceSubContent workspaceId={id} />
      </Collapsible.Content>
    </Collapsible.Collapsible>
  )
}

function SidebarWorkspaceList() {
  const { data: workspaces } = useQuery(WorkspaceQueries.currentUserWorkspacesQuery())

  return (
    <div className='mt-3 flex w-full flex-col'>
      {workspaces?.map((workspaceItem, index) => (
        <SidebarWorkspaceItem workspace={workspaceItem} key={index} />
      ))}
    </div>
  )
}

export default SidebarWorkspaceList
