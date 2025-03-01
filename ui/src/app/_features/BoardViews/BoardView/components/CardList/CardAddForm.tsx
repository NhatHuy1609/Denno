import React, { useEffect, useRef } from 'react'
import CustomizableButton from '@/ui/components/CustomizableButton'
import { HiOutlineXMark } from 'react-icons/hi2'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import { useOnClickOutSide } from '@/app/_hooks/useOnClickOutSide'

interface Props {
  hideFormFn: () => void
}

function CardAddForm({ hideFormFn }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleHideForm = () => {
    hideFormFn && hideFormFn()
  }

  useOnClickOutSide(formRef, handleHideForm)

  return (
    <form ref={formRef} className='flex w-full flex-col gap-2'>
      <PrimaryInputText
        ref={inputRef}
        placeholder='Enter a title or paste a link'
        className='w-full rounded-md px-2 pb-8'
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
