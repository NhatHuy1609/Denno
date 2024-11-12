import React from 'react'
import { WorkspaceQueries } from '@/entities/workspace'
import { queryClient } from '@/lib/react-query/query-client'
import { PersistedStateKey } from '@/data/persisted-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { getLocalStorageItem } from '@/utils/local-storage'
import { workspaceTypesDto, workspaceContractsDto } from '@/service/api/workspace'
import { useForm, Controller } from 'react-hook-form'
import { useWorkspaceQuery } from '@/app/_hooks/query'
import useUpdateWorkspaceMutation from './workpsaceUpdate.mutation'
import { Button, Form, toastSuccess } from '@/ui'

const UpdateFormSchema = workspaceContractsDto.UpdateWorkspaceDtoSchema
type UpdateFormValues = workspaceTypesDto.UpdateWorkspaceDto

interface IWorkspaceUpdateFormProps {
  hideForm?: () => void
}

function WorkspaceUpdateForm({ hideForm }: IWorkspaceUpdateFormProps) {
  const workspaceId = getLocalStorageItem(PersistedStateKey.RecentAccessWorkspace)
  const { data: workspace } = useWorkspaceQuery(workspaceId)

  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<UpdateFormValues>({
    defaultValues: {
      name: workspace?.name,
      description: workspace?.description
    },
    resolver: zodResolver(UpdateFormSchema)
  })

  const canUpdateForm = isValid

  const { mutate: updateWorkspace, isPending } = useUpdateWorkspaceMutation({
    onSuccess: async (response) => {
      const { status } = response
      if (status === 204) {
        toastSuccess('Update workspace successfully!')
        queryClient.invalidateQueries({
          queryKey: WorkspaceQueries.workspaceQuery(workspaceId).queryKey
        })
      }
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const onSubmit = (data: UpdateFormValues) => {
    updateWorkspace({
      workspaceId,
      data
    })
    hideForm && hideForm()
  }

  const handleHideForm = () => {
    hideForm && hideForm()
  }

  return (
    <div className='w-64'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-4'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <Form.Input title='Name*' size='lg' value={field.value} onChange={field.onChange} />
          )}
        />

        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Form.Textarea
              title='Description (optional)'
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className='flex items-center gap-2'>
          <Button
            title='Save'
            primary
            type='submit'
            loading={isPending}
            disabled={!canUpdateForm || isPending}
          />
          <Button
            title='Cancel'
            onClick={handleHideForm}
            className='bg-gray-200 hover:bg-gray-300'
          />
        </div>
      </form>
    </div>
  )
}

export default WorkspaceUpdateForm
