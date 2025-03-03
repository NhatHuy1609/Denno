import { z } from 'zod'
import React, { useEffect, useRef } from 'react'
import type { cardTypesDto } from '@/service/api/card'
import { CardQueries, cardTypes } from '@/entities/card'
import { useQueryClient } from '@tanstack/react-query'
import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutSide'
import { useForm, Controller } from 'react-hook-form'
import { useCardListContext } from './context'
import useCreateCardMutation from '@/app/_hooks/mutation/card/useCreateCardMutation'
import { HiOutlineXMark } from 'react-icons/hi2'
import { toastError } from '@/ui'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import CustomizableButton from '@/ui/components/CustomizableButton'

interface Props {
  hideFormFn: () => void
}

const FormValueSchema = z.object({
  name: z.string().min(1)
})

type FormValues = z.infer<typeof FormValueSchema>

function CardAddForm({ hideFormFn }: Props) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { cardListData } = useCardListContext()
  const { reset, control, handleSubmit } = useForm<FormValues>()
  const { mutate: createCard, isPending } = useCreateCardMutation({
    onSuccess(data, variables) {
      // Optimistic update
      queryClient.setQueryData(
        CardQueries.cardsByCardListQuery(cardListData?.id as string).queryKey,
        (oldCards) => {
          return [...(oldCards as cardTypes.Cards), data]
        }
      )
    },
    onError() {
      toastError('Failed to create new card')
    },
    onSettled() {
      // Reset form
      reset()
      const inputElement = inputRef.current as HTMLInputElement
      inputElement.value = ''
      inputElement.select()
    }
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleHideForm = () => {
    hideFormFn && hideFormFn()
  }

  useOnClickOutSide(formRef, handleHideForm)

  const onSubmit = (data: FormValues) => {
    if (!cardListData?.id || !data.name) {
      hideFormFn && hideFormFn()
      return
    }

    // Calling API to create card
    const createCardDto: cardTypesDto.CreateCardDto = {
      name: data.name,
      cardListId: cardListData?.id
    }
    createCard(createCardDto)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={formRef} className='flex w-full flex-col gap-2'>
      <Controller
        control={control}
        name='name'
        render={({ field }) => (
          <PrimaryInputText
            ref={inputRef}
            onChange={field.onChange}
            placeholder='Enter a title or paste a link'
            className='w-full rounded-md px-2 pb-8'
          />
        )}
      />
      <div className='flex items-center gap-2'>
        <CustomizableButton
          type='submit'
          intent='primary'
          size='small'
          value='Add card'
          className='font-medium'
        />
        <CustomizableButton
          intent='icon'
          size='icon'
          type='button'
          onClick={() => {
            handleHideForm()
          }}
          startIcon={<HiOutlineXMark className='text-2xl' />}
          className='basis-[32px] hover:bg-[var(--ds-background-neutral-hovered)]'
        />
      </div>
    </form>
  )
}

export default CardAddForm
