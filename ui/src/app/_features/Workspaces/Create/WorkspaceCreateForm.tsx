import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { workspaceContractsDto, workspaceTypesDto } from '@/service/api/workspace'
import { useForm, Controller } from 'react-hook-form'
import useCreateWorkspaceMutation from './create.mutation'
import { ScrollArea, Form, Button } from '@/ui'

import WorkspaceImage from 'public/workspace_create_image.svg'
import Image from 'next/image'

type FormValues = workspaceTypesDto.CreateWorkspaceDto

function WorkspaceCreateForm() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(workspaceContractsDto.CreateWorkspaceDtoSchema)
  })

  const { mutate: createWorkspace, isPending } = useCreateWorkspaceMutation()

  const onSubmit = (data: FormValues) => {
    createWorkspace(data)
  }

  return (
    <ScrollArea className='h-[400px] min-w-[400px] px-6'>
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
