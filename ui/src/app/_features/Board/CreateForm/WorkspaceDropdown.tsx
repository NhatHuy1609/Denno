import React from 'react'
import { cn } from '@/lib/styles/utils'
import { FaAngleDown } from 'react-icons/fa'
import { DropdownMenu } from '@/ui'
import { workspaceTypes } from '@/entities/workspace'
import { useBoardCreateForm } from './context'
import useCurrentUserWorkspacesQuery from '@/app/_hooks/query/useCurrentUserWorkspacesQuery'

function WorkspaceDropdownItem({
  workspace
}: {
  workspace: workspaceTypes.Workspace
}) {
  const { setFormValue, workspaceId } = useBoardCreateForm()
  const { name, id } = workspace

  const isSelected = workspaceId === id

  const handleSelectWorkspace = () => {
    setFormValue('workspaceId', id)
  }

  return (
    <div
      onClick={handleSelectWorkspace}
      className={cn(
        'flex cursor-pointer items-center gap-4 px-2 py-2 hover:bg-gray-100',
        isSelected && 'bg-blue-100 hover:bg-blue-200'
      )}
    >
      <span
        className={cn('tex-gray-700 text-sm', isSelected && 'text-blue-600')}
      >
        {name}
      </span>
    </div>
  )
}

function WorkspaceDropdown() {
  const { selectedWorkspace } = useBoardCreateForm()
  const { data: userWorkspaces = [] } = useCurrentUserWorkspacesQuery()

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className='flex-1'>
        <div className='flex w-full items-center justify-between rounded-sm border border-stone-500 bg-white px-3 py-2 text-sm'>
          {selectedWorkspace?.name}
          <FaAngleDown className='text-xs' />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className='w-[300px] max-w-[300px]'>
        {userWorkspaces.map((workspace, index) => (
          <DropdownMenu.Item key={index}>
            <WorkspaceDropdownItem workspace={workspace} />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export default WorkspaceDropdown
