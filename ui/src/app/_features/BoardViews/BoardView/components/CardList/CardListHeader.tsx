import React from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

interface IProps {
  name?: string
}

function CardListHeader({ name }: IProps) {
  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <div className='w-full flex-1 pl-3'>
          <h3 className='text-sm font-medium text-[var(--ds-accent-text)]'>{name}</h3>
        </div>
        <button
          type='button'
          className='flex size-8 items-center justify-center rounded-md hover:bg-[var(--ds-accent-background-hovered)]'
        >
          <HiOutlineDotsHorizontal />
        </button>
      </div>
    </div>
  )
}

export default CardListHeader
