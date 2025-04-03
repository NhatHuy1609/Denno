import React from 'react'
import type { Tabs } from './types'
import TabButton from './TabButton'

type Props = {
  setTabFn: (val: Tabs) => void
}

function CollaboratorsTabs({ setTabFn }: Props) {
  return (
    <div className='flex min-w-[250px] flex-col gap-2'>
      <TabButton text='Workspace members (2)' tabName='members' setTabFn={setTabFn} />
      <TabButton text='Guests (1)' tabName='guests' setTabFn={setTabFn} />
      <TabButton text='Requests (0)' tabName='requests' setTabFn={setTabFn} />
    </div>
  )
}

export default CollaboratorsTabs
