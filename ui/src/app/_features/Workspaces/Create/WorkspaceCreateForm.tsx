import { z } from 'zod'
import React from 'react'
import Image from 'next/image'
import WorkspaceImage from 'public/workspace_create_image.svg'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import useCreateWorkspaceMutation from './create.mutation'
import { getErrorMessage } from '@/service/api/_getErrorMessage'
import { ScrollArea, Form, Button, toastSuccess, toastError } from '@/ui'
import useCurrentUserWorkspacesQuery from '@/app/_hooks/query/user/useCurrentUserWorkspacesQuery'

const FormSchema = z
  .object({
    name: z.string({ required_error: 'Name required!' }).min(1, { message: 'Name required!' }),
    description: z.string({ required_error: 'Description required!' }).min(1, { message: 'Description required!' })
  })
  .describe('CreateWorkspaceDtoSchema')

type FormValues = z.infer<typeof FormSchema>

function WorkspaceCreateForm() {
  const { data: workspaces, refetch } = useCurrentUserWorkspacesQuery({})

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
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
      refetch()
    },
    onSettled: () => {
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

        <Button size='base' type='submit' primary block title='Create' loading={isPending} disabled={isPending} />
      </form>
    </ScrollArea>
  )
}

export default WorkspaceCreateForm
