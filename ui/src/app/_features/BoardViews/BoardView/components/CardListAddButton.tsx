import { z } from 'zod'
import { Button } from '@/ui'
import React, { useRef, useState } from 'react'
import { Form } from '@/ui'
import { FiPlus } from 'react-icons/fi'
import { RxCross1 } from 'react-icons/rx'
import { useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutSide'
import useCreateCardListMutation from '../mutations/createCardList.mutation'
import { CardListQueries, cardListSchemas } from '@/entities/cardList'

const CreateCardListFormSchema = z.object({
  name: z.string().min(1)
})

type CreateCardListFormValues = z.infer<typeof CreateCardListFormSchema>

function CardListAddForm({ hideForm }: { hideForm: () => void }) {
  const { boardId } = useParams()
  const queryClient = useQueryClient()
  const ref = useRef<HTMLFormElement>(null)

  const {
    reset,
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<CreateCardListFormValues>({
    defaultValues: {
      name: ''
    }
  })

  const { mutate: createCardList, isPending } = useCreateCardListMutation({
    onSuccess: (data) => {
      queryClient.setQueryData(CardListQueries.cardListsByBoardQuery(boardId as string).queryKey, (old) => {
        return [...(old as cardListSchemas.CardLists), data]
      })
    },
    onSettled: () => {
      // Reset create form
      reset()
      hideForm && hideForm()
    }
  })

  useOnClickOutSide(ref, () => {
    hideForm && hideForm()
  })

  const handleHideForm = () => {
    hideForm && hideForm()
  }

  const onSubmitCreateCardListForm = (data: CreateCardListFormValues) => {
    const { name } = data
    createCardList({
      name,
      boardId: boardId as string
    })
  }

  const isCreateBtnDisabled = !isValid || isPending

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit(onSubmitCreateCardListForm)}
      className='absolute left-0 top-0 w-full rounded-xl bg-white p-3'
    >
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <Form.Input
            size='lg'
            className='mb-2'
            value={field.value}
            onChange={field.onChange}
            placeholder='Enter list name...'
          />
        )}
      />

      <div className='flex w-full items-center gap-2'>
        <Button type='submit' primary title='Add list' disabled={isCreateBtnDisabled} loading={isCreateBtnDisabled} />
        <button
          type='button'
          onClick={handleHideForm}
          className='flex size-8 items-center justify-center rounded-sm hover:bg-black/10'
        >
          <RxCross1 className='text-lg font-bold text-black' />
        </button>
      </div>
    </form>
  )
}

function CardListAddButton() {
  const [showForm, setShowForm] = useState(false)

  const handleShowForm = () => {
    setShowForm(true)
  }

  const handleHideForm = () => {
    setShowForm(false)
  }

  return (
    <div className='relative h-auto w-[var(--ds-card-list-width)] shrink-0'>
      {showForm ? (
        <CardListAddForm hideForm={handleHideForm} />
      ) : (
        <button
          onClick={handleShowForm}
          className='flex w-full items-center gap-2 rounded-xl bg-[#ffffff3d] p-3 hover:bg-[--ds-button-hovered]'
        >
          <FiPlus className='text-xl text-white' />
          <span className='text-sm font-semibold text-white'>Add another list</span>
        </button>
      )}
    </div>
  )
}

export default CardListAddButton
