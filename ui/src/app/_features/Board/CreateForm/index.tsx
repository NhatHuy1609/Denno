import React from 'react'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { queryClient } from '@/lib/react-query/query-client'
import { BoardQueries } from '@/entities/board'
import { PHOTOS_BACKGROUND } from '@/data/board-photo-backgrounds'
import { useForm, Controller } from 'react-hook-form'
import { useCreateBoardMutation } from './boardCreate.mutation'
import useCurrentUserWorkspacesQuery from '@/app/_hooks/query/useCurrentUserWorkspacesQuery'
import { zodResolver } from '@hookform/resolvers/zod'
import { boardTypesDto } from '@/service/api/board'
import { boardContractsDto } from '@/service/api/board'
import { CreateFormProvider as BoardCreateFormProvider } from './context'
import { Button, Form, FormGroup, ScrollArea, toastSuccess } from '@/ui'
import WorkspaceDropdown from './WorkspaceDropdown'
import VisibilityDropdown from './VisibilityDropdown'
import BoardBackgroundSelection from './BoardBackgroundSelection'
import BoardBackgroundSelectionDisplay from './BoardBackgroundSelectionDisplay'

type FormValues = boardTypesDto.CreateBoardDto

function BoardCreateForm() {
  const { data: userWorkspaces = [] } = useCurrentUserWorkspacesQuery({})

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isDirty, isValid }
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      visibility: 'Workspace',
      workspaceId:
        getLocalStorageItem(PersistedStateKey.RecentAccessWorkspace) || userWorkspaces[0].id || '',
      background: PHOTOS_BACKGROUND[0].url
    },
    resolver: zodResolver(boardContractsDto.CreateBoardDtoSchema)
  })

  const { mutate: createBoard, isPending } = useCreateBoardMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BoardQueries.boardsByWorkspaceIdQuery(getValues('workspaceId')).queryKey
      })
      toastSuccess('Board created successfully')
    },
    onError: (error) => {
      console.log(error)
    },
    onSettled: () => {
      reset()
    }
  })

  const backgroundValue = watch('background')
  const visibilityValue = watch('visibility')
  const workspaceIdValue = watch('workspaceId')
  const selectedWorkspace = userWorkspaces.find((item) => item.id === workspaceIdValue)

  const canSend = isDirty || isValid

  const onSubmit = (data: FormValues) => {
    createBoard(data)
  }

  return (
    <BoardCreateFormProvider
      value={{
        setFormValue: setValue,
        visibility: visibilityValue,
        workspaceId: workspaceIdValue,
        backgroundSource: backgroundValue,
        selectedWorkspace: selectedWorkspace
      }}
    >
      <ScrollArea className='mt-4 h-[420px] max-w-[300px] pl-2 pr-6' type='always'>
        <BoardBackgroundSelectionDisplay />

        <form className='mt-4 flex flex-col justify-center gap-4' onSubmit={handleSubmit(onSubmit)}>
          <BoardBackgroundSelection />
          <FormGroup helper='👋 Board title is required'>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Form.Input
                  size='lg'
                  title='Board title'
                  placeholder="John's board"
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </FormGroup>

          <FormGroup title='Workspace'>
            <WorkspaceDropdown />
          </FormGroup>

          <FormGroup title='Visibility'>
            <VisibilityDropdown />
          </FormGroup>

          <Button
            block
            primary
            size='base'
            type='submit'
            title='Create'
            loading={isPending}
            disabled={!canSend}
          />
        </form>
        <p className='mt-3 text-[11px] text-gray-600'>
          By using images from Unsplash, you agree to their license and Terms of Service
        </p>
      </ScrollArea>
    </BoardCreateFormProvider>
  )
}

export default BoardCreateForm
