import React from 'react'
import { Popover } from '@/ui'
import BoardCreateForm from '@/app/_features/Board/CreateForm'

function CreateFirstBoardButton() {
  return (
    <Popover.Popover>
      <Popover.Trigger>
        <div className='rounded-sm bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700'>
          Create your first board
        </div>
      </Popover.Trigger>
      <Popover.Content side='right' className='-translate-y-8 p-0 py-4'>
        <div className='w-full px-2'>
          <span className='block w-full text-center text-sm font-medium'>Create board</span>
          <BoardCreateForm />
        </div>
      </Popover.Content>
    </Popover.Popover>
  )
}

export default CreateFirstBoardButton
