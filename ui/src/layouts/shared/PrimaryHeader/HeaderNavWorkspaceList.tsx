import React from 'react'
import WorkspaceLinkNavigation from '@/app/_components/WorkspaceLinkNavigation'
import WorkspaceLogo from '@/app/_components/WorkspaceLogo'
import useCurrentUserWorkspacesQuery from '@/app/_hooks/query/user/useCurrentUserWorkspacesQuery'
import { userSchemas } from '@/entities/user'

function HeaderNavWorkspaceItem({ workspace }: { workspace: userSchemas.UserWorkspace }) {
  const { id: workspaceId, logo, name } = workspace

  return (
    <WorkspaceLinkNavigation
      workspaceId={workspaceId}
      className='block flex w-full items-center gap-2 rounded-sm p-2 hover:bg-gray-100'
    >
      <WorkspaceLogo imageUrl={logo} name={name} size='base' />
      <span className='text-sm font-medium text-black'>{name}</span>
    </WorkspaceLinkNavigation>
  )
}

export default function HeaderNavWorkspaceList() {
  const { data: workspaces } = useCurrentUserWorkspacesQuery({
    filter: {
      filter: 'all'
    }
  })

  return (
    <div className='flex w-[224px] flex-col gap-1'>
      {workspaces?.map((workspace) => <HeaderNavWorkspaceItem key={workspace.id} workspace={workspace} />)}
    </div>
  )
}
