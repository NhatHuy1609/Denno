import React from 'react'
import { WorkspaceQueries } from '@/entities/workspace'
import { queryClient } from '@/lib/react-query/query-client'
import { useParams } from 'next/navigation'
import useUpdateWorkspaceLogoMutation from '../updateWorkspaceLogo.mutation'
import { LuLoader2 } from 'react-icons/lu'
import { toastSuccess, toastError } from '@/ui'

function RemoveLogoButton() {
  const { workspaceId } = useParams()

  const { mutate: updateWorkspace, isPending } = useUpdateWorkspaceLogoMutation({
    onSuccess: () => {
      toastSuccess('Delete logo successfully')
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueries.workspaceQuery(workspaceId as string).queryKey
      })
    },
    onError: (error) => {
      console.log(error)
      toastError('Remove logo failed')
    }
  })

  const handleRemoveWorkspaceLogo = () => {
    updateWorkspace({
      workspaceId: workspaceId as string,
      data: {
        logoFile: null
      }
    })
  }

  return (
    <button
      type='button'
      disabled={isPending}
      onClick={handleRemoveWorkspaceLogo}
      className='flex items-center justify-center gap-1 rounded-sm bg-red-500 px-2 py-1 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60'
    >
      {isPending && <LuLoader2 className='size-4 animate-spin text-white' />}
      Remove logo
    </button>
  )
}

export default RemoveLogoButton
