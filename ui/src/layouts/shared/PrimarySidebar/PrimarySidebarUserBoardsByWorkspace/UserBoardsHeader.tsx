import React from 'react'
import { FaPlus } from 'react-icons/fa6'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { Popover } from '@/ui'
import BoardCreateForm from '@/app/_features/Board/CreateForm'

function MoreButton() {
  return (
    <div className='flex size-6 cursor-pointer items-center justify-center rounded-sm hover:bg-white/20'>
      <HiOutlineDotsHorizontal className='text-base text-white' />
    </div>
  )
}

function CreateBoardButton() {
  return (
    <Popover.Popover>
      <Popover.Trigger>
        <div className='flex size-6 items-center justify-center rounded-sm hover:bg-white/20'>
          <FaPlus className='text-sm text-white' />
        </div>
      </Popover.Trigger>
      <Popover.Content side='right' className='px-0'>
        <div className='w-full'>
          <h3 className='text-center text-sm text-black'>Create Board</h3>
          <BoardCreateForm />
        </div>
      </Popover.Content>
    </Popover.Popover>
  )
}

function BoardsControls() {
  return (
    <div className='group absolute right-3 top-0 flex w-full items-center justify-end gap-2'>
      <div className='hidden group-hover:block'>
        <MoreButton />
      </div>
      <CreateBoardButton />
    </div>
  )
}

function UserBoardsHeader() {
  return (
    <div className='relative flex w-full items-center justify-between px-3'>
      <span className='block text-sm font-medium text-white'>Your boards</span>
      <BoardsControls />
    </div>
  )
}

export default UserBoardsHeader
