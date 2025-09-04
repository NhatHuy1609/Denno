import React from 'react'
import PopoverActionWrapper from '@/app/_components/PopoverActionWrapper'
import BoardCreateForm from '../CreateForm'

type Props = {
  selectedWorkspaceId: string
}

function CreateNewBoardButton({ selectedWorkspaceId }: Props) {
  return (
    <PopoverActionWrapper
      renderTrigger={() => (
        <button
          type='button'
          className='flex items-center justify-center rounded-md border border-gray-300 bg-gray-200 text-sm text-gray-500 shadow-sm hover:bg-gray-300'
        >
          Create new board
        </button>
      )}
      renderContent={() => <BoardCreateForm selectedWorkspaceId={selectedWorkspaceId} />}
      contentConfigs={{
        side: 'right',
        avoidCollisions: true
      }}
    />
  )
}

export default CreateNewBoardButton
