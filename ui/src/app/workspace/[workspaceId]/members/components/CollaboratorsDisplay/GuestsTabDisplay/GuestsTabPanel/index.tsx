import React from 'react'
import GuestsFilterInput from './GuestsFilterInput'
import GuestsDisplay from './GuestsDisplay'
import { workspaceSchemas } from '@/entities/workspace'

type Props = {
  guests: workspaceSchemas.Workspace['guests']
}

function GuestsTabPanel({ guests }: Props) {
  return (
    <div className='flex w-full flex-col'>
      <GuestsFilterInput />
      <GuestsDisplay guests={guests} />
    </div>
  )
}

export default GuestsTabPanel
