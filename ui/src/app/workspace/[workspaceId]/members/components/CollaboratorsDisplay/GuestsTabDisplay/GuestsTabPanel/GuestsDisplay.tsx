import React from 'react'
import { workspaceSchemas } from '@/entities/workspace'
import GuestItem from './GuestItem'

type Props = {
  guests: workspaceSchemas.Workspace['guests']
}

function GuestsDisplay({ guests }: Props) {
  if (guests.length == 0) {
    return (
      <div className='my-6 w-full text-center text-xl font-medium text-gray-400'>
        There are no guests in this workspace
      </div>
    )
  }

  return (
    <div className='flex w-full flex-col'>
      {guests.map((guest) => (
        <GuestItem key={guest.user.id} guest={guest} />
      ))}
    </div>
  )
}

export default GuestsDisplay
