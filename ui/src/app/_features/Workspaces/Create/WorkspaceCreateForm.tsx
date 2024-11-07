import React from 'react'
import Image from 'next/image'
import WorkspaceImage from 'public/workspace_create_image.svg'
import { queryClient } from '@/lib/react-query/query-client'
import { WorkspaceQueries } from '@/entities/workspace'
import { workspaceContractsDto, workspaceTypesDto } from '@/service/api/workspace'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import useCreateWorkspaceMutation from './create.mutation'
import { getErrorMessage } from '@/service/api/_getErrorMessage'
import { ScrollArea, Form, Button, toastSuccess, toastError } from '@/ui'

type FormValues = workspaceTypesDto.CreateWorkspaceDto

function WorkspaceCreateForm() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(workspaceContractsDto.CreateWorkspaceDtoSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const { mutate: createWorkspace, isPending } = useCreateWorkspaceMutation({
    onError: (error) => {
      const { message } = getErrorMessage(error)
      toastError(message)
    },
    onSuccess: () => {
      toastSuccess('Workspace created successfully')
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueries.currentUserWorkspacesQuery().queryKey
      })
    },
    onSettled: () => {
      console.log('reset workspace create form')
      reset()
    }
  })

  const onSubmit = (data: FormValues) => {
    createWorkspace(data)
  }

  return (
    <ScrollArea className='h-[400px] min-w-[400px] px-4'>
      <div className='flex w-full justify-center'>
        <Image alt='workspace-image' src={WorkspaceImage} className='w-[200px]' />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <Form.Input
              size='lg'
              title='Workspace name'
              placeholder="Taco's Co."
              value={field.value}
              onChange={field.onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Form.Textarea
              rows={5}
              title='Workspace description'
              placeholder='Our team organizes everything here'
              value={field.value}
              onChange={field.onChange}
              error={errors.description?.message}
            />
          )}
        />

        <Button
          size='base'
          type='submit'
          primary
          block
          title='Create'
          loading={isPending}
          disabled={isPending}
        />
      </form>
    </ScrollArea>
  )
}

export default WorkspaceCreateForm
