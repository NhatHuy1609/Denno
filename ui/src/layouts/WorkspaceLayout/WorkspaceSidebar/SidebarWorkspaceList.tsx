import React, { ReactNode, useState } from 'react'
import { cn } from '@/lib/styles/utils'
import Link from 'next/link'
import { setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/local-storage/persisted-keys'
import { LiaAngleDownSolid } from 'react-icons/lia'
import { HiViewBoards } from 'react-icons/hi'
import { FaRegHeart } from 'react-icons/fa6'
import { LuUsers } from 'react-icons/lu'
import { Collapsible } from '@/ui'
import WorkspaceLogo from '@/app/_components/WorkspaceLogo'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import useCurrentUserWorkspacesQuery from '@/app/_hooks/query/user/useCurrentUserWorkspacesQuery'
import { useParams, usePathname } from 'next/navigation'
import { match } from 'path-to-regexp'
import WaterFallLoading from '@/app/_components/Loadings/WaterFallLoading'

interface IWorkspaceSubItem {
  title: string
  icon: ReactNode
  href: string
  onClick?: () => void
  matchPath: string
}

function SidebarWorkspaceSubContentItem({ item, workspaceId }: { item: IWorkspaceSubItem; workspaceId: string }) {
  const pathName = usePathname()
  const { icon, href, title, matchPath, onClick } = item

  // Create matcher function to check if current path matches
  const matcher = match(matchPath, { decode: decodeURIComponent })
  const pathMatchedResult = matcher(pathName)

  const isActive = pathMatchedResult !== false && workspaceId === pathMatchedResult.params.workspaceId

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('flex cursor-pointer items-center gap-2 rounded-md py-2 pl-10 pr-2 hover:bg-gray-200', {
        'bg-blue-100 text-blue-500 hover:bg-blue-100': isActive
      })}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: cn('text-sm', isActive ? 'text-blue-600' : 'text-slate-600')
      })}
      <span className={cn('text-[13px] font-medium text-slate-600', isActive && 'text-blue-600')}>{title}</span>
    </Link>
  )
}

function SidebarWorkspaceSubContent({ workspaceId }: { workspaceId: string }) {
  const items: IWorkspaceSubItem[] = [
    {
      title: 'Boards',
      icon: <HiViewBoards />,
      href: `/workspace/${workspaceId}/home`,
      onClick: () => {
        setLocalStorageItem(PersistedStateKey.RecentAccessWorkspace, workspaceId)
      },
      matchPath: `/workspace/:workspaceId/home`
    },
    {
      title: 'Highlights',
      icon: <FaRegHeart />,
      href: `/workspace/${workspaceId}/highlights`,
      matchPath: '/workspace/:workspaceId/highlights'
    },
    {
      title: 'Members',
      icon: <LuUsers />,
      href: `/workspace/${workspaceId}/members`,
      matchPath: `/workspace/:workspaceId/members`
    }
  ]

  return (
    <div className='mt-1 flex flex-col gap-[2px]'>
      {items.map((item, index) => {
        return <SidebarWorkspaceSubContentItem key={index} item={item} workspaceId={workspaceId} />
      })}
    </div>
  )
}

function SidebarWorkspaceItem({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false)
  const { data: workspace } = useWorkspaceQuery(workspaceId)
  const { workspaceId: workspaceIdFromPath } = useParams<{ workspaceId: string }>()

  const { id = '', name = '', logo = '' } = workspace || {}

  const isActive = workspaceIdFromPath === workspaceId

  return (
    <Collapsible.Collapsible open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className='w-full' asChild>
        <div
          className={cn(
            'group flex cursor-pointer items-center justify-between rounded-md p-2 pr-4 hover:bg-gray-200',
            {
              'bg-blue-100 text-blue-600 text-slate-700 hover:bg-blue-100': isActive && !open
            }
          )}
        >
          <div className='flex items-center gap-2'>
            <WorkspaceLogo name={name} imageUrl={logo} size='sm' />
            <span
              className={cn('text-sm font-semibold text-slate-700', {
                'text-blue-600': isActive && !open
              })}
            >
              {name}
            </span>
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
  const { data: workspaces, isLoading } = useCurrentUserWorkspacesQuery({})

  if (isLoading) {
    return (
      <div className='mt-4 flex w-full items-center justify-center'>
        <WaterFallLoading />
      </div>
    )
  }

  return (
    <div className='mt-3 flex w-full flex-col'>
      {workspaces?.map((workspaceItem, index) => (
        <SidebarWorkspaceItem workspaceId={workspaceItem.id} key={workspaceItem.id} />
      ))}
    </div>
  )
}

export default SidebarWorkspaceList
